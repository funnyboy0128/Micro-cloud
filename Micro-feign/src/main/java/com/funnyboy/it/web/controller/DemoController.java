package com.funnyboy.it.web.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.funnyboy.it.rest.RestService;

@RestController
@RequestMapping("/demo")
public class DemoController {
	
	@Autowired
	private RestService restService;

    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public Map<String,String> test(){
    	Map<String,String> result = restService.test();
    	return result;
    }
    
}
