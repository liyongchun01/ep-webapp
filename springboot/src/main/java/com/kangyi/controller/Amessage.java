package com.kangyi.controller;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.kangyi.pojo.*;
import com.kangyi.service.*;
import com.kangyi.util.StringTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/message")
@CrossOrigin(origins = {"http://localhost:8000"},allowCredentials = "true",allowedHeaders = {"X-Custom-Header"},
        maxAge = 3600L)
public class Amessage {

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
    @ResponseBody
    public Map<String, Object> getBokeList(
            @RequestBody  Map<String, Object> data
    ){
//        Map<String, Object> map = new HashMap<>(3);
        Integer type=(Integer)data.get( "type" );
        Integer pno=(Integer)data.get( "pno" );
        Integer psize=(Integer)data.get( "psize" );
        Integer parentRead=(Integer)data.get( "parentRead" );
        Integer messageType=(Integer)data.get( "messageType" );
        Long userId= Long.valueOf( String.valueOf( data.get("userId" )));
        if (pno == null){
            pno=1;
        }
        if (psize==null){
            psize=10;
        }
        if (type==null){
            type=0;
        }
        String sortField="insertTime";
        String sortType="desc";

        Page<Object> p = PageHelper.startPage( pno, psize );
        //申请消息3
        List<Jiaru> fromJiaruList = jiaruService.selectManyByStatusUserId( -1, userId,parentRead,sortField,sortType,type );
        List<Jiaru> toJiaruList = jiaruService.selectManyByStatusToUserId( -1, userId ,parentRead,sortField,sortType ,type);

        //评论文章1
//        commentService.
        List<Jiaru> okJJiaruList = jiaruService.selectManyByStatusUserId( 2, userId, -1 ,sortField,sortType,type );
        List<Long> orderIdList=null;
        for (Jiaru jiaru:okJJiaruList){
            orderIdList.add( jiaru.getOrderId() );
        }
        List<Comment> pingLunCommentList=commentService.getMessageByOrserIdList(orderIdList,parentRead,sortField,sortType,type );

        //2回复评论
        List<Comment> huifuCommentList=commentService.getMessageByParetId(userId,parentRead,sortField,sortType ,type);



//        gLstForPage = orderService.getListForPageByIdList( type, btime, etime, pno, psize, gOrderList, sortField, sortType, "guanzhu" );
//        jListForPage = orderService.getListForPageByIdList( type, btime, etime, pno, psize, jOrderList, sortField, sortType, "jiaru" );


        Map<String, Object> map = new HashMap<String, Object>();

        map.put( "fromJiaruList" ,fromJiaruList);
        map.put( "toJiaruList" ,toJiaruList);
        map.put( "pingLunCommentList" ,pingLunCommentList);
        map.put( "huifuCommentList" ,huifuCommentList);
        map.put( "pno",pno );
        map.put( "psize",psize );
        map.put( "count",p.getTotal() );
        map.put( "type",type );
        map.put( "parentRead",parentRead );
        map.put( "messageType",messageType );

        return map;


    }



    @GetMapping
    @PostMapping
    @RequestMapping("/jiaruOk")
    @ResponseBody
    public String jiaruOk(
            @RequestBody  Map<String, Object> data
    ){
        Long jiaruId = Long.valueOf( String.valueOf( data.get( "jiaruId" )));
        Long userId = Long.valueOf( String.valueOf( data.get( "userId" )));
        if (jiaruId==null||"null".equals( jiaruId )){
            return "失败";
        }

        Jiaru jiaru = new Jiaru();
        jiaru.setJiaru( (byte)2 );
        int i=jiaruService.updateOne(jiaruId,jiaru);
        if (i<=0){
            return "失败";
        }else {
            return "成功";
        }
    }



    @GetMapping
    @PostMapping
    @RequestMapping("/jiaruNo")
    @ResponseBody
    public String jiaruNo(
            @RequestBody  Map<String, Object> data
    ){
        Long jiaruId = Long.valueOf( String.valueOf( data.get( "jiaruId" )));
        Long userId = Long.valueOf( String.valueOf( data.get( "userId")) );
        String adminRemark = (String)data.get( "adminRemark" );
        if (jiaruId==null||"null".equals( jiaruId )){
            return "失败";
        }

        Jiaru jiaru = new Jiaru();
        jiaru.setJiaru( (byte)0 );
        jiaru.setAdminRemark( adminRemark );
        int i=jiaruService.updateOne(jiaruId,jiaru);
        if (i<=0){
            return "失败";
        }else {
            return "成功";
        }
    }

    @GetMapping
    @PostMapping
    @RequestMapping("/read")
    @ResponseBody
    public String updataComment(
            @RequestBody  Map<String, Object> data
    ){
        Long commentId = Long.valueOf( String.valueOf( data.get( "commentId")) );
        Long jiaruId = Long.valueOf( String.valueOf( data.get( "jiaruId")) );
        Long userId = Long.valueOf( String.valueOf( data.get( "userId" )));
        Integer messageType = (Integer)data.get( "messageType" );
        if (userId==null||"null".equals( userId )){
            return "失败";
        }

        int i=0;
        if (messageType==3){
            //jiaru的已读

        }else if(messageType<3&&messageType>0){
            //0系统消息和1评论和2回复
            Comment comment = new Comment();
            comment.setParentRead( String.valueOf( 1 ) );
            comment.setCommentId( commentId );
            i=commentService.updataOneById(commentId,comment);

        }
//        int i=commentService.delectOne(commentId);
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
