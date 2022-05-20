package com.kangyi.controller;


import com.kangyi.pojo.*;
import com.kangyi.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/jiaruAndGuanzhu")
@CrossOrigin(origins = {"http://localhost:8000"},allowCredentials = "true",allowedHeaders = {"X-Custom-Header"},
        maxAge = 3600L)
public class AjiaruAndGuanzhu {

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
            @RequestBody Map<String, Object> data
           ) {
//        Map<String, Object> map = new HashMap<>(3);
        Integer type = (Integer) data.get( "type" );
        Integer pno = (Integer) data.get( "pno" );
        Integer psize = (Integer) data.get( "psize" );
        Integer actType = (Integer) data.get( "actType" );
        Long userId = Long.valueOf( String.valueOf( data.get("userId")) );
        String btime = String.valueOf( data.get( "btime" ) );
        String etime = String.valueOf( data.get( "etime" ) );

        if (pno == null) {
            pno = 1;
        }
        if (psize == null) {
            psize = 10;
        }
        if (type == null) {
            type = 0;
        }
        String sortField = "insertTime";
        String sortType = "desc";
        if ("ascend".equals( String.valueOf( data.get( "sortType" ) ) )) {
            sortType = "asc";
        } else if ("descend".equals( String.valueOf( data.get( "sortType" ) ) )) {
            sortType = "desc";
        }

        if (data.get( "sortField" ) != null) {
            sortField = String.valueOf( data.get( "sortField" ) );
        }

        List<Jiaru> jiaruList = jiaruService.selectManyByStatusUserId( 2, userId, -1, sortField, sortType, type );
        List<Guanzhu> guanzhuList = guanzhuService.selectManyByStatusUserId( 1, userId );
        List<Long> jOrderList = null;
        List<Long> gOrderList = null;
        Map<String, Object> jListForPage = null;
        Map<String, Object> gLstForPage = null;

        //jiaru
        for (Jiaru j : jiaruList) {
            Long orderId = j.getOrderId();
            jOrderList.add( orderId );
        }
        jListForPage = orderService.getListForPageByIdList( type, btime, etime, pno, psize, jOrderList, sortField, sortType, "jiaru" );

        //guanzhu
        for (Guanzhu j : guanzhuList) {
            Long orderId = j.getOrderId();
            gOrderList.add( orderId );
        }
        gLstForPage = orderService.getListForPageByIdList( type, btime, etime, pno, psize, gOrderList, sortField, sortType, "guanzhu" );
//        jListForPage = orderService.getListForPageByIdList( type, btime, etime, pno, psize, jOrderList, sortField, sortType, "jiaru" );

        if (actType == 1) {
            //jiaru

            return jListForPage;

        } else if (actType == 2) {
            //guanzhu
            return gLstForPage;

        } else {
            //都
            Map<String, Object> combineResultMap = new HashMap<String, Object>();
            combineResultMap.putAll( jListForPage );
            combineResultMap.putAll( gLstForPage );
            return combineResultMap;

        }
    }

}
