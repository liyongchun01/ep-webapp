package com.kangyi.controller;

import com.kangyi.mapper.UserMapper;
import com.kangyi.pojo.Menu;
import com.kangyi.pojo.User;
import com.kangyi.pojo.UserExample;
import com.kangyi.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.kangyi.constant.Constant.YOUKEID;


@RestController
@RequestMapping(path = "/aaa",method = RequestMethod.POST)
@CrossOrigin(origins = {"http://localhost:3000"},allowCredentials = "true",allowedHeaders = {"X-Custom-Header"},
        maxAge = 3600L, methods={RequestMethod.GET,RequestMethod.POST,RequestMethod.HEAD})
public class aaa {

    @RequestMapping("/map")
    public Map<String, Object> getMap() {
        Map<String, Object> map = new HashMap<>(3);
//        User user = new User(1, "倪升武", "123456");
//        map.put("作者信息", user);
        map.put("博客地址", "http://blog.itcodai.com");
        map.put("CSDN地址", "http://blog.csdn.net/eson_15");
        map.put("粉丝数量", 4153);
        return map;
    }


//        @Autowired
//    private UserMapper userMapper;


    @GetMapping//查
    @ResponseBody
    public List<User> getList() {
        UserExample userEx = new UserExample();
        UserExample.Criteria criteria = userEx.createCriteria();
        criteria.andUsernameLike("admin");
//        List<User> list = userMapper.selectByExample(userEx);
//        return list;
            return  null;
    }


    @Autowired
    private MenuService menuService;



}
