package com.funnyboy.it.bootstrap;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class WebsiteBootstrap implements ServletContextListener {

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {

		System.err.println("---------------Application is shutdown -------------------------");
	}

	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		System.err.println("---------------Application is start up -------------------------");
	}

}
