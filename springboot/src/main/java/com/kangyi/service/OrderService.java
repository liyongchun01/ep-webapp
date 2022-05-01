package com.kangyi.service;

import com.kangyi.pojo.Order;
import com.kangyi.util.PageResult;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface OrderService {
    Map<String, Object> getListForPage(int type, String btime, String etime, int pno, int psize, Long userId, String sortField, String sortType);

    long insertOrder(Long userId, int type);

    int updateTypeIdOrderById(long orderId, long typeId);

    int updateAllOrderById(Order order);

    int delectOneById(Long orderId);

    int updateManyAllOrderById(List<Order> orderList);

    Order selectOneById(Long orderId);
}
