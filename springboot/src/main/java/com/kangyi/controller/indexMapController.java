package com.kangyi.controller;

import com.sun.deploy.net.URLEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.io.UnsupportedEncodingException;

@Controller
@RequestMapping(path = "/indexMap")
@CrossOrigin(origins = {"http://localhost:3000"},allowCredentials = "true",allowedHeaders = {"X-Custom-Header"},
        maxAge = 3600L, methods={RequestMethod.GET,RequestMethod.POST,RequestMethod.HEAD})
public class indexMapController {


    @RequestMapping("/jingweidu")
    public String jingweidu(String address,Model model)throws UnsupportedEncodingException{
        System.out.println("@#$address: "+address);
        model.addAttribute( "address1",address );
        if (address==null){
            address="越秀区";
        }
        System.out.println("   @!  "+model .getAttribute("address1") );

//        return "redirect:https://apis.map.qq.com/ws/geocoder/v1/?address=哈尔滨黑龙江工程学院&key=JYXBZ-3C5CJ-UBRF6-FOPY3-L546H-2BFIS";
//        return "redirect:/dzzz.htm?snType=sfzxq&zjlx=sfzxx&real_name=" + URLEncoder.encode(userInfo.getReal_name(),"UTF-8") + "&cert_no=" + userInfo.getCert_no();
//
//            return "redirect:https://apis.map.qq.com/ws/geocoder/v1/?address="+ URLEncoder.encode(address,"UTF-8");
            return "forward:https://apis.map.qq.com/ws/geocoder/v1/?address="+ URLEncoder.encode(address,"UTF-8")+"&key=JYXBZ-3C5CJ-UBRF6-FOPY3-L546H-2BFIS";
//
    }

    @RequestMapping("/map")
    public String index(HttpSession session, Model model){

        return "jsp/indexMap";
    }

    @RequestMapping("/map1")
    public String inde(HttpSession session, Model model){

        return "jsp/indexMap1";
    }
}
