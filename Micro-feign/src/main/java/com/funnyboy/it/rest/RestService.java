package com.funnyboy.it.rest;

import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @Description:Feign客户端
 * @author:funnyboy.ding@wiilead.com
 * @date:2019年3月11日
 */
@FeignClient(serviceId="DEMOSERVICE",path="/demoService/remote",fallback=FallbackService.class)
public interface RestService {
	
	@RequestMapping(value = "/test", method = RequestMethod.GET)
    public Map<String,String> test();
}
