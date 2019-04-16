package com.funnyboy.it.web.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.funnyboy.it.model.Demo;
import com.funnyboy.it.service.DemoService;

@RestController
@RequestMapping("/demo")
public class DemoController {

    @Autowired
    private DemoService demoService;

    @RequestMapping(value = "/page", method = RequestMethod.POST)
    @ResponseBody
    public List<Demo> page(@RequestBody Demo demo){
    	return demoService.findByDemoCode("");
    }
    
    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public Map<String,String> test(){
    	Map<String,String> result = new HashMap<String,String>();
    	result.put("msg", "hello Spring Cloud");
    	return result;
    }
    
    @RequestMapping(value = "/restTest", method = RequestMethod.GET)
    public Map<String,String> restTest(){
    	Map<String,String> result = new HashMap<String,String>();
    	result.put("msg", "hello Spring Cloud");
    	return result;
    }
    
}
