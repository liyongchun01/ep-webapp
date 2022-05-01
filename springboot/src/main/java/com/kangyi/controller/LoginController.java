package com.kangyi.controller;

import com.kangyi.pojo.Menu;
import com.kangyi.pojo.User;
import com.kangyi.service.MenuService;
import com.kangyi.service.UserService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.kangyi.constant.Constant.YOUKEID;

@RequestMapping("/login")
@Controller
@CrossOrigin(origins = {"http://localhost:8000"},allowCredentials = "true",allowedHeaders = {"X-Custom-Header"},
        maxAge = 3600L, methods={RequestMethod.GET,RequestMethod.POST,RequestMethod.HEAD})
public class LoginController {

    @Autowired
    private UserService userService;

    @Autowired
    private MenuService menuService;


    @RequestMapping("/page")
    public String login(){
        return "jsp/login";
    }

    @RequestMapping("/registerPage")
    public String registerPage(){
        return "jsp/register";
    }

    @CrossOrigin(origins="http://localhost:8000",allowCredentials = "true")
    @RequestMapping("/admin")
    public String loginAdmin(
          @RequestParam("username") String username,
          @RequestParam("password") String password,
            HttpServletRequest request,
            HttpServletResponse response,
            HttpSession session,
            Model m){


        System.out.println("@#$admin; "+username+" psd: "+password);
        User u = userService.login(username,password,request);

        System.err.println(u);
        if(u == null){
            Long roleId = YOUKEID;
            List<Menu> menuList = menuService.selectMenuListByRoleId(roleId);
//            HttpSession session = request.getSession();
            session.setAttribute("menuList",menuList);
            m.addAttribute("success",false);
            return "jsp/login";

        }else{
            List<Menu> menuList = menuService.selectMenuListByRoleId(u.getRoleId());
//            HttpSession session = request.getSession();
            session.setAttribute("menuList",menuList);
            session.setAttribute( "user",u );
            session.setAttribute( "userId",u.getId() );

            Cookie cookie = new Cookie( "userId", String.valueOf(u.getId()));
            cookie.setPath("/");
            System.out.println(cookie+"   is cookie");
            response.addCookie(cookie);


            System.out.println("  usid  "+session.getAttribute( "userId" ));
            m.addAttribute("success",true);
            return "forward:/index";

        }

    }


    @RequestMapping("/register")

    public String register(User user){

        System.out.println(user);
        if (user.getPassword().equals( user.getPassword1() )){


            int i = userService.insertUser( user );
            if (i>=1) {
                 System.out.println("@#$注册成功");
            }else {
            System.out.println("@#$注册失败");
            }
            System.out.println("username=  "+user.getUsername()+"  &password=  "+user.getPassword1());
            return "redirect:/login/admin?username="+user.getUsername()+"&password="+user.getPassword1();
        }else {
            return "register";
        }
    }


    @CrossOrigin(origins="http://localhost:8000",allowCredentials = "true")
    @RequestMapping("/getuser")
    @ResponseBody
    public User getuser(
//                            @RequestParam("username") String username,
//                             @RequestParam("password") String password,
                             HttpServletRequest request,
                             HttpServletResponse response,
                             HttpSession session,
                             Model m){
        System.out.println("index@@@@@getId3 :"+session.getId());

        User u = (User) session.getAttribute("userInfo");
//        User u = userService.login(username,password,request);
//        HashMap<String, Object> map = new HashMap<>();
        System.err.println(u);

        if (u == null){
            u = new User();
            u.setId( Long.valueOf( 0 ) );

        }

       return u;

    }

    @RequestMapping("/logout")
    public String logout(){
        Subject subject = SecurityUtils.getSubject();
        subject.logout();
        return "redirect:/index";
    }
}
