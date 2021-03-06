package ewing.application.config;

import ewing.application.exception.ResultException;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 全局异常捕获，优先级高于默认错误页面。
 *
 * @author Ewing
 */
@Component
public class ExceptionHandler implements HandlerExceptionResolver {

    /**
     * RequestBody返回普通文本，否则返回错误视图。
     */
    @Override
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception e) {
        if (hasResponseBody(handler)) {
            MappingJackson2JsonView view = new MappingJackson2JsonView();
            view.addStaticAttribute("success", false);
            if (e instanceof ResultException) {
                ResultException re = ((ResultException) e);
                view.addStaticAttribute("code", re.getCode());
                view.addStaticAttribute("message", re.getMessage());
                view.addStaticAttribute("data", re.getData());
            } else {
                view.addStaticAttribute("code", 0);
                view.addStaticAttribute("message", "失败了！");
                view.addStaticAttribute("data", e.getClass()
                        .getSimpleName() + ": " + e.getMessage());
            }
            return new ModelAndView(view);
        } else {
            return new ModelAndView("error");
        }
    }

    private boolean hasResponseBody(Object handler) {
        if (!(handler instanceof HandlerMethod)) {
            return false;
        }
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        return AnnotationUtils.findAnnotation(handlerMethod.getMethod(), ResponseBody.class) != null
                || AnnotationUtils.findAnnotation(handlerMethod.getBeanType(), ResponseBody.class) != null;
    }

}