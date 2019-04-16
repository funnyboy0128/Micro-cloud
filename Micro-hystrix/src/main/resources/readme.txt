1、使用hystrix
step1、添加依赖
	<dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
    </dependency>

step2、启动类开启 @EnableHystrix  
step3、feign.hystrix.enabled: true  
step4、通过@HystrixCommand 或结合Feign的@FeignClient使用

2、使用hystrix-dashboard
step、添加依赖
	<dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-hystrix-dashboard</artifactId>
    </dependency>
step2、启动类开启@EnableHystrixDashboard
step3、management.security.enabled: false
step4、进入主页：http://IP:PORT/应用/hystrix
                输入http://IP:PORT/应用/hystrix/actuator/hystrix.stream进入详情页面
    
    