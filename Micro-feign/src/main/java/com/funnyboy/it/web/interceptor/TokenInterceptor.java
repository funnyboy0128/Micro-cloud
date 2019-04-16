package com.funnyboy.it.web.interceptor;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import feign.RequestInterceptor;
import feign.RequestTemplate;

@Component
public class TokenInterceptor implements RequestInterceptor {

	@Override
	public void apply(RequestTemplate requestTemplate) {

		HttpServletRequest request = getHttpServletRequest();
		if(request == null) {
			return;
		}
		String token  = request.getHeader("token");
		requestTemplate.header("token", token);
	}
	
	private HttpServletRequest  getHttpServletRequest(){
		
		try {
			return ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		}catch (Exception e) {
			return null;
		}
	}
}
