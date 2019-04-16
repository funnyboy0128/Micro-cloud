package com.funnyboy.it.service;

import org.springframework.stereotype.Service;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;

@Service
public class UserService {
	
	@HystrixCommand(fallbackMethod="fallBackGetUser")
	public String getUser(String user) throws Exception{
		if("admin".equals(user)) {
			return "OK";
		}else {
			throw new Exception();
		}
	}
	
	public String fallBackGetUser(String user) {
		return "Sorry,the user is not exist";
	}

}
