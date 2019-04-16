package com.funnyboy.it.web.controller;

import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.QueryParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.funnyboy.it.rest.RestService;
import com.funnyboy.it.service.UserService;

@RestController
@RequestMapping("/demo")
public class DemoController {
	
	@Autowired
	private RestService restService;

	@Autowired
	private UserService userService;
	
    /**
     * 在Feign中使用Hystrix
     * @return
     */
    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public Map<String,String> test(){
    	Map<String,String> result = restService.test();
    	return result;
    }
    
    /**
     * 独立使用，测试断路器
     * @param userName
     * @return
     */
    @RequestMapping(value = "/hystrix", method = RequestMethod.GET)
    public Map<String,String> hystrix(@QueryParam("userName")String userName){
    	try {
    	String msg = userService.getUser(userName);
			Map<String, String> result = new HashMap<String, String>();
			result.put("msg", msg);

			return result;
		} catch (Exception e) {
			e.printStackTrace();
		}
    	return null;
    }
    
    
}
