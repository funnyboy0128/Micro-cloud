package com.funnyboy.it.web.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component
public class GlobalTokenFilter implements GlobalFilter,Ordered {

	@Override
	public int getOrder() {
		return 0;
	}

	@Override
	public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
		
		String token = exchange.getRequest().getQueryParams().getFirst("token");
		if(token == null || token.isEmpty()) {
			//exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
			//return exchange.getResponse().setComplete();
		}
		
		//向Header中存入数据
		ServerHttpRequest info = exchange.getRequest().mutate().header("token", "这里填写认证信息token").build();
		ServerWebExchange exchange1 = exchange.mutate().request(info).build();
		
		return chain.filter(exchange1);
	}
}
