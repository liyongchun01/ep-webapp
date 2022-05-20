package com.kangyi.controller;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.kangyi.pojo.*;
import com.kangyi.service.*;
import com.kangyi.util.StringTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/boke")
@CrossOrigin(origins = {"http://localhost:8000"},allowCredentials = "true",allowedHeaders = {"X-Custom-Header"},
        maxAge = 3600L, methods={RequestMethod.GET,RequestMethod.POST,RequestMethod.HEAD})
public class Aboke {

    @Autowired
    OrderService orderService;

    @Autowired
    GuiJiService guiJiService;

    @Autowired
    HeSuanService heSuanService;

    @Autowired
    YiMiaoService yiMiaoService;

    @Autowired
    GeLiService geLiService;



    @Autowired
    GuanzhuService guanzhuService;

    @Autowired
    JiaruService jiaruService;

    @Autowired
    CommentService commentService;

    @GetMapping
    @PostMapping
    @RequestMapping("/list")
//    @ResponseBody
    public Map<String, Object> getBokeList(
//            @RequestBody  Map<String, Object> data,
            @RequestParam(value = "pno",defaultValue = "1") Integer pno,
            @RequestParam(value = "psize",defaultValue = "10") Integer psize,
            @RequestParam(value = "type",defaultValue = "10") Integer type,
            @RequestParam(value = "typeId",defaultValue = "10") Long typeId,
            @RequestParam(value = "orderId",defaultValue = "10") Long orderId,
            @RequestParam(value = "userId",defaultValue = "10") Long userId

    ){
//        Map<String, Object> map = new HashMap<>(3);
//        System.out.println("!@#bokelist data :"+data);

//        Integer type=(Integer)data.get( "type" );
//        Integer pno=(Integer)data.get( "pno" );
//        Integer psize=(Integer)data.get( "psize" );
//        Long typeId = Long.valueOf( String.valueOf( data.get( "typeId" ) ) );
//        Long orderId= Long.valueOf( String.valueOf( data.get("orderId" )));
//        Long typeId= (Long) data.get( "typeId" );
//        Long userId= Long.valueOf( String.valueOf( data.get("userId" )));
        if (pno == null){
            pno=1;
        }
        if (psize==null){
            psize=10;
        }
        if (type==null){
            type=0;
        }

        Map<String,Object> map=commentService.getPageByOrderId(orderId,pno,psize);

        Jiaru jiaru=jiaruService.selectOneByTwo(orderId,userId);
        Byte jiaruStatus = 0;
        if (jiaru!=null) {
            jiaruStatus =jiaru.getJiaru();
        }
            map.put( "jiaru", jiaruStatus );



        Guanzhu guanzhu=guanzhuService.selectOneByTwo(orderId,userId);
        Byte guanzhuStatus = 0;
        if (guanzhu!=null){
            guanzhuStatus=guanzhu.getGuanzhu();
        }
        map.put( "guanzhu",guanzhuStatus );


        Order order = orderService.selectOneById( orderId );

        if (order.getUserId()!=3l){
            if (order.getUserId()== userId||jiaruStatus==2){
                map.put( "louzhu",1 );
            }else{
                map.put( "louzhu",0 );
            }
        }else {
            if (userId==1l||userId==3l||jiaruStatus==2){
                map.put( "louzhu",1 );
            }else{
                map.put( "louzhu",0 );
            }
        }



        if(type==1){

            HeSuan heSuan = heSuanService.getOneById( typeId );
            System.out.println("@#$bokelist hesuan "+heSuan);
            map.put( "hesuan",heSuan  );


        }else if (type==2){

            YiMiao yiMiao = yiMiaoService.getOneById( typeId );
            map.put( "yimiao",yiMiao );

        }else if (type==3){

            GeLi geLi = geLiService.getOneById( typeId );
            map.put( "geli",geLi );

        }else {
            if(typeId!=null){

                String handelRemark = order.getHandelRemark();
                JSONObject json_qiege = JSONObject.parseObject(handelRemark);
                String desc = json_qiege.getString( "desc" );

                GuiJi guiJi=guiJiService.selectOneById(typeId);

                try {
                    String qiekai = StringTest.StringChangeJSON( desc );
                    guiJi.setQiekai( qiekai );
                    guiJi.setData( desc );
                    map.put( "guiji",guiJi );
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }


        }
        map.put( "type",type );

        System.out.println("@#$bokelist map "+map.get( "hesuan" ));

        return map;

    }

    @GetMapping
    @PostMapping
    @RequestMapping("/addComment")
//    @ResponseBody
    public String addComment(
            @RequestBody  Map<String, Object> data
    ){
//        String content=(String)data.get( "content" );
//        Integer pno=(Integer)data.get( "parentId" );
//        Integer psize=(Integer)data.get( "psize" );
//        Long orderId= (Long) data.get( "orderId" );
//        Long parentId= (Long) data.get( "parentId" );
//        Long sendId= (Long) data.get( "sendId" );

        JSONObject.DEFFAULT_DATE_FORMAT="yyyy-MM-dd HH:mm:ss";
        String commentSt = JSONObject.toJSONString( data );
        Comment comment= JSON.parseObject( commentSt, Comment.class);
        System.out.println("@#$addcomment "+comment);
        if (comment==null||"null".equals( comment )){
            return "评论失败 comment空";
        }
        int i=commentService.insertOne(comment);
        if (i<=0){
            return "评论失败 sql失败";
        }else {
            return "评论成功";
        }
    }

    @GetMapping
    @PostMapping
    @RequestMapping("/delectComment")
    @ResponseBody
    public String delectComment(
            @RequestBody  Map<String, Object> data
    ){
        Long commeId = Long.valueOf( String.valueOf( data.get( "commeId" )));
        Long userId = Long.valueOf( String.valueOf( data.get( "userId" )));
        if (commeId==null||"null".equals( commeId )){
            return "删除失败";
        }


//        Comment comment=commentService.selectOneById(commeId);
        int i=commentService.delectOne(commeId);
        if (i<=0){
            return "评论失败";
        }else {
            return "评论成功";
        }
    }

    @GetMapping
    @PostMapping
    @RequestMapping("/upComment")
    @ResponseBody
    public String updataComment(
            @RequestBody  Map<String, Object> data
    ){
        Long commeId = Long.valueOf( String.valueOf( data.get( "commeId" )));
        Long userId = Long.valueOf( String.valueOf( data.get( "userId" )));
        Integer level = (Integer)data.get( "level" );
        if (commeId==null||"null".equals( commeId )){
            return "失败";
        }


        Comment comment = new Comment();
        comment.setLevel( (byte)level.intValue() );
        comment.setCommentId( commeId );
        int i=commentService.updataOneById(commeId,comment);
//        int i=commentService.delectOne(commeId);
        if (i<=0){
            return "失败";
        }else {
            return "成功";
        }
    }

    @GetMapping
    @PostMapping
    @RequestMapping("/jiaru")
    @ResponseBody
    public String jiaruBoke(
            @RequestBody  Map<String, Object> data
    ){
//        String content=(String)data.get( "content" );
//        Integer pno=(Integer)data.get( "parentId" );
//        Integer psize=(Integer)data.get( "psize" );
//        Long orderId= (Long) data.get( "orderId" );
//        Long parentId= (Long) data.get( "parentId" );
//        Long sendId= (Long) data.get( "sendId" );

        JSONObject.DEFFAULT_DATE_FORMAT="yyyy-MM-dd HH:mm:ss";
        String st = JSONObject.toJSONString( data );
        Jiaru jiaru= JSON.parseObject( st, Jiaru.class);
        if (jiaru==null||"null".equals( jiaru )){
            return "失败";
        }
        int i=jiaruService.insertOne(jiaru);
        if (i<=0){
            return "失败";
        }else {
            return "成功";
        }
    }

    @GetMapping
    @PostMapping
    @RequestMapping("/guanzhu")
    @ResponseBody
    public String guanzhuBoke(
            @RequestBody  Map<String, Object> data
    ){
//        String content=(String)data.get( "content" );
//        Integer pno=(Integer)data.get( "parentId" );
//        Integer psize=(Integer)data.get( "psize" );
//        Long orderId= (Long) data.get( "orderId" );
//        Long parentId= (Long) data.get( "parentId" );
//        Long sendId= (Long) data.get( "sendId" );

        JSONObject.DEFFAULT_DATE_FORMAT="yyyy-MM-dd HH:mm:ss";
        String st = JSONObject.toJSONString( data );
        Guanzhu guanzhu= JSON.parseObject( st, Guanzhu.class);
        if (guanzhu==null||"null".equals( guanzhu )){
            return "失败";
        }
        int i=guanzhuService.insertOne(guanzhu);
        if (i<=0){
            return "失败";
        }else {
            return "成功";
        }
    }

}
