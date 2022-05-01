package com.kangyi;

import com.kangyi.mapper.HeSuanMapper;
import com.kangyi.pojo.HeSuan;
import com.kangyi.pojo.HeSuanExample;
import com.kangyi.pojo.Order;
import com.kangyi.service.OrderService;
import com.kangyi.util.PageResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;

@SpringBootTest
class Kangyi01ApplicationTests {

    @Autowired
    OrderService orderService;

    @Autowired
    HeSuanMapper heSuanMapper;


    @Test
    void contextLoads() {
//        Map<String, Object> pageResult =orderService.getListForPage( 1,10, (long) 1,null,null );
//        System.out.println(pageResult);
//        System.out.println("22");

        HeSuanExample heSuanExample = new HeSuanExample();
        HeSuanExample.Criteria criteria = heSuanExample.createCriteria();
        List<HeSuan> heSuans = heSuanMapper.selectByOrderStatusAndExample( heSuanExample);
        System.out.println(heSuans);
    }

}
