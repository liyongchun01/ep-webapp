package com.kangyi;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.server.session.DefaultWebSessionManager;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.SessionCookieConfig;
import javax.servlet.SessionTrackingMode;
import java.util.Collections;

@SpringBootApplication
@EnableTransactionManagement
//@ComponentScan({"com.*"})
@MapperScan(basePackages = "com.kangyi.mapper")
public class Kangyi01Application  {

///extends SpringBootServletInitializer
//    DefaultWebSessionManager defaultWebSessionManager = new DefaultWebSessionManager();

//System.out.println(defaultWebSessionManager.isSessionIdUrlRewritingEnabled()); // true
//defaultWebSessionManager.setSessionIdUrlRewritingEnabled(false);
//System.out.println(defaultWebSessionManager.isSessionIdUrlRewritingEnabled());
//
//    public void onStartup(ServletContext servletContext) throws ServletException {
//        super.onStartup(servletContext);
//        servletContext.setSessionTrackingModes(
//                Collections.singleton( SessionTrackingMode.COOKIE));
//        SessionCookieConfig sessionCookieConfig =
//                servletContext.getSessionCookieConfig();
//        sessionCookieConfig.setHttpOnly(true);
//    }

    public static void main(String[] args) {
        SpringApplication.run( Kangyi01Application.class, args );
    }

}
