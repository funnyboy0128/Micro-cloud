package com.funnyboy.it.rest;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class FallbackService implements RestService {

	@Override
	public Map<String, String> test() {
		Map<String, String> fallBackRest = new HashMap<String,String>();
		fallBackRest.put("error", "调用远程服务失败");
		return fallBackRest;
	}

}
