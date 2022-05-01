package com.kangyi.controller;

import com.kangyi.pojo.*;
import com.kangyi.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.*;


@RestController
@RequestMapping(path = "/check")
@CrossOrigin(origins = {"http://localhost:8000"},allowCredentials = "true",allowedHeaders = {"X-Custom-Header"},
        maxAge = 3600L)
//@CrossOrigin(origins = {"http://localhost:8000"},allowCredentials = "true",allowedHeaders = {"X-Custom-Header"},
//        maxAge = 3600L, methods={RequestMethod.GET,RequestMethod.POST,RequestMethod.HEAD})
public class ACheck {

        @Autowired
    OrderService orderService;

        @Autowired
    GuiJiService guiJiService;

        @Autowired
    GeLiService geLiService;

        @Autowired
    HeSuanService heSuanService;

        @Autowired
        YiMiaoService yiMiaoService;

        @Autowired
        UserService userService;

    @GetMapping
    @PostMapping
    @RequestMapping(path = "/userlist")
//    @ResponseBody
    public List<User> userlist(){
        return userService.selectAll();

    }


    @GetMapping
    @PostMapping
    @RequestMapping(path = "/list")
    @ResponseBody
    public Map<String, Object> getList(
//            @RequestParam(value = "sortField",defaultValue = "") String sortField,
//            @RequestParam(value = "sortType",defaultValue = "") String sortType,
            @RequestBody  Map<String, Object> map,
//            @RequestParam(value = "etime",defaultValue = "null") String etime,
//            @RequestParam(value = "btime",defaultValue = "null") String btime,
            HttpSession session
    ) {

        System.out.println("  !" +map.toString());
        String sortField="insertTime";
        String sortType="desc";


        String btime= String.valueOf( map.get( "btime" ) );
        String etime= String.valueOf( map.get( "etime" ) );
        Integer type1=(Integer)map.get( "type" );
        Integer pno1=(Integer)map.get( "pno" );
        Integer psize1=(Integer)map.get( "psize" );
//         System.out.println("@#$ :"+psize1);
//         System.out.println("@#$2 :"+map.get( "psize" ));
        Long userId=null;
//        if (map.get( "userId" )!=null){
//            userId= Long.parseLong( map.get( "userId" ).toString() );
//            System.out.println("$$  !! 普通userId: "+userId);
//        }

        if (pno1 == null){
            pno1=1;
        }
        if (psize1==null){
            psize1=20;
        }
        if (type1==null){
            type1=0;
        }
        if ("ascend".equals( String.valueOf(map.get( "sortType" )) )){
            sortType="asc";
        }else  if("descend".equals( String.valueOf(map.get( "sortType" ) ))){
            sortType="desc";
        }

        if (map.get( "sortField" )!=null){
            sortField= String.valueOf( map.get( "sortField" ) );
        }

        Map<String, Object> listForPage = orderService.getListForPage( type1, btime, etime, pno1, psize1, userId, sortField, sortType );
        List<Order> orders = (List<Order>)listForPage.get( "order" );
        return  listForPage;
    }


    @GetMapping
    @PostMapping
    @RequestMapping(value = "/ok")
//    @Transactional
    public Map<String,Object> updateOK(

            String orderId

    ){
        Map<String, Object> map = new HashMap<>(3);
        System.out.println("@@ok orderId :"+orderId);
        if (orderId!=null) {
            Order order = new Order();
            order.setOrderId( Long.valueOf( orderId ) );
            order.setStatus( 2 );
            order.setHandleTime( new Date(  ) );


            int i = orderService.updateAllOrderById( order );
            if (i >= 1) {
                map.put( "msg", "修改成功 " );
            } else {
                map.put( "msg", "修改失败" );
            }
        }else {map.put( "msg", "修改失败" );}
        return map;
    }


    @GetMapping
    @PostMapping
    @RequestMapping(value = "/no")
//    @Transactional
    public Map<String,Object> updateNO(

            String orderId,
            String handelRemark

    ){
        Map<String, Object> map = new HashMap<>(3);

        System.out.println("@@ok orderId :"+orderId);
        if (orderId!=null) {
            Order order = new Order();
            order.setOrderId( Long.valueOf( orderId ) );
            order.setHandelRemark( handelRemark );
            order.setHandleTime( new Date(  ) );

            order.setStatus( 3 );


            int i = orderService.updateAllOrderById( order );
            if (i >= 1) {
                map.put( "msg", "修改成功 " );
            } else {
                map.put( "msg", "修改失败" );
            }
        }else { map.put( "msg", "修改失败" );}


        return map;
    }


    @GetMapping
    @PostMapping
    @RequestMapping(value = "/updateone")
    @Transactional
    public Map<String,Object> upadteone(

            Order order

    ){
        Map<String, Object> map = new HashMap<>(3);


        order.setUpdateTime( new Date( ) );
        int i = orderService.updateAllOrderById( order );
        if (i>=1) {
            map.put( "msg", "修改成功 " );
        }else { map.put("msg", "修改失败");}
        return map;
    }

    @GetMapping
    @PostMapping
    @RequestMapping(value = "/updatemany")
    @Transactional
    public Map<String,Object> upadteMany(
            List<Order> orderList
//            Order order

    ){
        Map<String, Object> map = new HashMap<>(3);
        int i = orderService.updateManyAllOrderById( orderList );


//        int i = orderService.updateAllOrderById( order );
        if (i>=1) {
            map.put( "msg", "修改成功  " );
        }else { map.put("msg", "修改失败");}
        return map;
    }







    @GetMapping
    @PostMapping
    @ResponseBody
    @RequestMapping(path = "/delect")
    public Map<String,Object> delect(
            @RequestParam(value = "orderId",defaultValue = "") Long orderId,
            @RequestParam(value = "typeId",defaultValue = "") Long typeId,
            @RequestParam(value = "type",defaultValue = "") int type
    ){

        Map<String, Object> map = new HashMap<>(3);


        if(type==1){
            int i = heSuanService.delectOneById(typeId);
            if (i>=1) {
                map.put( "msg", "删除成功  " );
            }else { map.put("msg", "删除失败");}


        }else if (type==2){
            int i  = yiMiaoService.delectOneById(typeId);
            if (i>=1) {
                map.put( "msg", "删除成功  " );
            }else { map.put("msg", "删除失败");}


        }else if (type==3){

            int i=geLiService.delectOneById(typeId);
            if (i>=1) {
                map.put( "msg", "删除成功  " );
            }else { map.put("msg", "删除失败");}


        }else if (type==4){

            int i =guiJiService.delectManyByOrderId(orderId);
            if (i>=1) {
                map.put( "msg", "删除成功  " );
            }else { map.put("msg", "删除失败");}

        }

        orderService.delectOneById(orderId);

        return map;

    }









}
