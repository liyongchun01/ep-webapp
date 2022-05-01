package com.kangyi.service.impl;

import com.kangyi.mapper.GuiJiMapper;
import com.kangyi.pojo.GeLi;
import com.kangyi.pojo.GuiJi;
import com.kangyi.pojo.GuiJiExample;
import com.kangyi.service.GeLiService;
import com.kangyi.service.GuiJiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

import static com.kangyi.util.StringToDate.YNDhmNewDateString;
import static com.kangyi.util.StringToDate.dateAddTian;

@Service
public class GuiJiServiceImpl implements GuiJiService {


    @Autowired
    GuiJiMapper guiJiMapper;
//    @Override
    public int insertListGuiJi(ArrayList<GuiJi> listGuiJi, long orderId, Long userId, int type) {
//        GuiJi guiJi = new GuiJi();
        int i=0;

        for (GuiJi guiJi:listGuiJi
             ) {
            guiJi.setUserId( userId );
            guiJi.setOrderId( orderId );
//            Date starttime = guiJi.getStarttime();
            Date endtime = guiJi.getEndtime();
            Date date = new Date();
            Calendar cal = Calendar.getInstance();
            cal.setTime(endtime);
            cal.add(Calendar.DATE, 14);
            Date enddate =cal.getTime();
            guiJi.setEnddate( enddate );
            guiJi.setArea( YNDhmNewDateString() );
            i+=guiJiMapper.insert( guiJi );
            System.out.println(guiJi);

        }


        return i;
    }

    @Override
    public Map<String,Object>  getManyByOrderId(Long orderId) {
        Map<String, Object> map = new HashMap<>(3);
        GuiJiExample guiJiExample = new GuiJiExample();
        GuiJiExample.Criteria criteria = guiJiExample.createCriteria();
        criteria.andOrderIdEqualTo( orderId );
//        map = (Map<String, Object>)guiJiMapper.selectByExample( guiJiExample );
        List<GuiJi> guiJis = guiJiMapper.selectByExample( guiJiExample ) ;




        map.put( "guiji",guiJis );

        return map;
    }

    @Override
    public int updateManyByOrderId(Long orderId, ArrayList<GuiJi> listGuiJi) {
        int i=0;

        for (GuiJi guiJi:listGuiJi
        ) {
            GuiJiExample guiJiExample = new GuiJiExample();
            GuiJiExample.Criteria criteria = guiJiExample.createCriteria();
            Long guijiId = guiJi.getGuijiId();
           criteria.andGuijiIdEqualTo( guijiId );


            GuiJi guiJi1 = guiJiMapper.selectByPrimaryKey( guijiId );
            if (guiJi1==null){
                //如果没有这类似的数据就新增
                guiJi.setOrderId( orderId );
                guiJi.setArea( YNDhmNewDateString() );
                System.out.println("这是没有此轨迹，新增一下");
                i +=guiJiMapper.insert( guiJi );

            }else {


                criteria.andOrderIdEqualTo( orderId );
                guiJi.setArea( YNDhmNewDateString() );
                i += guiJiMapper.updateByExampleSelective( guiJi, guiJiExample );
            }
        }
        return i;



    }

    @Override
    public int delectManyByOrderId(Long orderId) {

        GuiJiExample guiJiExample = new GuiJiExample();
        GuiJiExample.Criteria criteria = guiJiExample.createCriteria();
        criteria.andOrderIdEqualTo( orderId );
        int i = guiJiMapper.deleteByExample( guiJiExample );


        return i;
    }

    @Override
    public List<GuiJi> selectManyByJingWeiDu(BigDecimal bigWeiDu, BigDecimal smallWeiDu, BigDecimal bigJingDu, BigDecimal smalJingDu) {
        GuiJiExample guiJiExample = new GuiJiExample();
        GuiJiExample.Criteria criteria = guiJiExample.createCriteria();
        criteria.andJinduBetween( smalJingDu,bigJingDu );
        criteria.andWeiduBetween( smallWeiDu,bigWeiDu );
        criteria.andEnddateGreaterThanOrEqualTo( dateAddTian(new Date(  ),1) );
        List<GuiJi> guiJiList = guiJiMapper.selectByOrderStatusAndExample( guiJiExample );


        return guiJiList;
    }
}