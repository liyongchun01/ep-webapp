package com.kangyi.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.kangyi.mapper.OrderMapper;
import com.kangyi.pojo.Order;
import com.kangyi.pojo.OrderExample;
import com.kangyi.service.OrderService;
import com.kangyi.util.ChangeChar;
import com.kangyi.util.PageResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.kangyi.util.StringToDate.YMDmToDate;
import static com.kangyi.util.StringToDate.YMDmsToDate;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
     OrderMapper orderMapper;

    @Override
    public Map<String, Object> getListForPage(int type, String btime, String etime, int pno, int psize, Long userId, String sortField, String sortType) {

        Page<Order> p = PageHelper.startPage( pno, psize );

        OrderExample oe = new OrderExample();
        OrderExample.Criteria criteria = oe.createCriteria();

        if(sortField!=null&&sortField.trim().length()>0){
            oe.setOrderByClause(ChangeChar.camelToUnderline(sortField,2) +" " +sortType);

        }

        if(userId != null){
            criteria.andUserIdEqualTo( userId );
            System.out.println("@#$orderlist userid "+userId);
        }

        if(type >0 && type < 5){
            criteria.andTypeEqualTo( type );
            System.out.println("@#$orderlist type "+type);
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date beginTimeDate = null;
        if(btime!=null){
            beginTimeDate=YMDmToDate(btime);
//            btime = btime + " 00:00:00";
//            try {
//                beginTimeDate = sdf.parse(btime);
//            } catch (ParseException e) {
//                beginTimeDate = null;
////                System.out.println("日期空的");
//            }
//            criteria.andInsertTimeGreaterThanOrEqualTo(beginTimeDate);
        }
        Date endTimeDate = null;
        if(etime!=null){
            endTimeDate=YMDmToDate(etime);
//            etime = etime + " 23:59:59";
//            try {
//                endTimeDate = sdf.parse(etime);
//                System.out.println("@#$y etime: "+etime);
//            } catch (ParseException e) {
//                beginTimeDate = null;
////                System.out.println("日期空的");
//                System.out.println("@#$x etime: "+etime);
//
//            }
//            criteria.andInsertTimeLessThanOrEqualTo(endTimeDate);
        }
                if(beginTimeDate != null && endTimeDate != null){
            criteria.andInsertTimeBetween( beginTimeDate,endTimeDate );
        }

        if(sortField!=null&&sortField.trim().length()>0){
            oe.setOrderByClause( ChangeChar.camelToUnderline(sortField,2) +" " +sortType);

        }

        List<Order> orders = orderMapper.selectByExample( oe );

        Map<String, Object> map = new HashMap<>(3);

        map.put("order", orders);
        map.put("pno", pno);
        map.put("psize", psize);
        map.put("count", p.getTotal());
        return map;




    }

    @Override
    public long insertOrder(Long userId, int type) {
        Order order = new Order();
        order.setUserId( userId );
        order.setType( type );
        order.setStatus( 1 );
        order.setInsertTime( new Date(  ) );
        orderMapper.insertAndGetId( order );
        Long orderId = order.getOrderId();

        return orderId;
    }

    @Override
    public long insertOrder(Long userId, int type,int status,String ydata) {

//        System.out.println("@#$!!!");
        Order order = new Order();
        order.setHandelRemark( ydata );
        if (ydata.length()<100){
            order.setUserRemark( ydata.substring( 0, ydata.length()-1 ) );

        }else {
            order.setUserRemark( ydata.substring( 0, 100 ) );
        }
//        System.out.println("@#$2"+order);
        order.setUserId( userId );
        order.setType( type );
        order.setStatus( status );
        order.setInsertTime( new Date(  ) );
        orderMapper.insertAndGetId( order );
        Long orderId = order.getOrderId();
//        System.out.println("@#$2"+orderId);

        return orderId;
    }

    @Override
    public int updateTypeIdOrderById(long orderId, long typeId) {
        Order order = new Order();
        order.setTypeId( typeId );
        OrderExample orderExample = new OrderExample();
        orderExample.createCriteria().andOrderIdEqualTo( orderId );

        int i = orderMapper.updateByExampleSelective( order, orderExample );

        return i;
    }

    @Override
    public int updateAllOrderById(Order order) {
        Long orderId = order.getOrderId();
        order.setUpdateTime( new Date( ) );
        OrderExample orderExample = new OrderExample();
        orderExample.createCriteria().andOrderIdEqualTo( orderId );

        int i = orderMapper.updateByExampleSelective( order, orderExample );
        return i;

    }

    @Override
    public int delectOneById(Long orderId) {

        OrderExample orderExample = new OrderExample();
        OrderExample.Criteria criteria = orderExample.createCriteria();
        criteria.andOrderIdEqualTo( orderId );

        return orderMapper.deleteByExample( orderExample);

    }

    @Override
    public int updateManyAllOrderById(List<Order> orderList) {
        int i=0;
        for (Order order:orderList){
            Long orderId = order.getOrderId();
            order.setUpdateTime( new Date( ) );
            OrderExample orderExample = new OrderExample();
            orderExample.createCriteria().andOrderIdEqualTo( orderId );

            i += orderMapper.updateByExampleSelective( order, orderExample );
        }
        return i;
    }

    @Override
    public Order selectOneById(Long orderId) {
        OrderExample orderExample = new OrderExample();
        OrderExample.Criteria criteria = orderExample.createCriteria();
        criteria.andOrderIdEqualTo( orderId );
        List<Order> orders = orderMapper.selectByExample( orderExample );
        Order order1 = orders.get( 0 );

        return order1;
    }


}
