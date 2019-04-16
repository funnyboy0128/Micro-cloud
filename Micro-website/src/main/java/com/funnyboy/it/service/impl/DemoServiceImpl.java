package com.funnyboy.it.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import com.funnyboy.it.model.Demo;
import com.funnyboy.it.repository.DemoRepository;
import com.funnyboy.it.service.DemoService;

@Service
public class DemoServiceImpl implements DemoService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private DemoRepository demoRepository;

    @Override
    public List<Demo> findAll() {
        return demoRepository.findAll();
    }

    @Override
    public Demo add(Demo object) {
        return demoRepository.save(object);
    }

    @Override
    public Demo edit(Demo object) {
        return demoRepository.save(object);
    }

    @Override
    public void del(String id) {
        demoRepository.deleteById(id);
    }

    @Override
    public Demo findById(String id) {
        return demoRepository.findById(id).get();
    }

    @Override
    public List<Demo> findByDemoCode(String demoCode) {
        return demoRepository.findByDemoCode(demoCode);
    }

    @Async
    @Override
    public void sendMessage() {
        logger.info("sendMessage");
    }
}
