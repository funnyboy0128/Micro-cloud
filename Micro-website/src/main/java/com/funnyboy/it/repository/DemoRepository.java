package com.funnyboy.it.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.funnyboy.it.model.Demo;

public interface DemoRepository extends JpaRepository<Demo,String> {

    public List<Demo> findByDemoCode(String demoCode);

}