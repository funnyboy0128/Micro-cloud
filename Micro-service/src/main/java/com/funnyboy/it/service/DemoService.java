package com.funnyboy.it.service;
import java.util.List;

import com.funnyboy.it.model.Demo;

public interface DemoService {

    public List<Demo> findAll();

    public Demo add(Demo object);

    public Demo edit(Demo object);

    public void del(String id);

    public Demo findById(String id);

    public List<Demo> findByDemoCode(String demoCode);

    public void sendMessage();
}
