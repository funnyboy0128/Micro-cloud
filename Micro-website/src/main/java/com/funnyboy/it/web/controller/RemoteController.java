package com.funnyboy.it.web.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@RestController
@RequestMapping("/remote")
public class RemoteController {

	@RequestMapping(value = "/test", method = RequestMethod.GET)
	public Map<String, String> test() {

		HttpServletRequest request = getHttpServletRequest();
		if(request != null) {
			String token = request.getHeader("token");
			System.err.println("token="+token);
		}
		
		Map<String, String> result = new HashMap<String, String>();
		result.put("msg", "Message from Remote Server");
		return result;
	}

	private HttpServletRequest getHttpServletRequest() {

		try {
			return ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		} catch (Exception e) {
			return null;
		}
	}
}