package com.kangyi.quartz.controller;

import com.kangyi.mapper.QuartzBeanMapper;
import com.kangyi.pojo.QuartzBean;
import com.kangyi.quartz.QuartzUtils;
import com.kangyi.service.QuartzBeanService;
import org.quartz.Scheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.Map;

@Controller
@RequestMapping("/quartz/")
@CrossOrigin(origins = {"http://localhost:8000"},allowCredentials = "true",allowedHeaders = {"X-Custom-Header"},
        maxAge = 3600L, methods={RequestMethod.GET,RequestMethod.POST,RequestMethod.HEAD})
public class QuartzController {
    //注入任务调度
    @Autowired
    private Scheduler scheduler;

    @Autowired
    QuartzBeanService quartzBeanService;

    @RequestMapping("/list")
    @GetMapping
    @PostMapping
    @ResponseBody
    public Map<String, Object> getList(
            @RequestBody  Map<String, Object> map,
            HttpSession session
    ) {

//        System.out.println("  !" +map.toString());
        String sortField="insertTime";
        String sortType="desc";


//        String userId= String.valueOf( map.get( "userId" ) );
        String JobName= String.valueOf( map.get( "JobName" ) );
        Integer status=(Integer)map.get( "status" );
        Integer pno1=(Integer)map.get( "pno" );
        Integer psize1=(Integer)map.get( "psize" );
//         System.out.println("@#$ :"+psize1);
//         System.out.println("@#$2 :"+map.get( "psize" ));
//        Long userId=null;
////        if (map.get( "userId" )!=null){
////            userId= Long.parseLong( map.get( "userId" ).toString() );
////            System.out.println("$$  !! 普通userId: "+userId);
////        }
        if (pno1 == null){
            pno1=1;
        }
        if (psize1==null){
            psize1=20;
        }
        if (status==null){
            status=0;
        }
        if ("ascend".equals( String.valueOf(map.get( "sortType" )) )){
            sortType="asc";
        }else  if("descend".equals( String.valueOf(map.get( "sortType" ) ))){
            sortType="desc";
        }

        if (map.get( "sortField" )!=null){
            sortField= String.valueOf( map.get( "sortField" ) );
        }

        Map<String, Object> listForPage = quartzBeanService.getListForPage( status, JobName, pno1, psize1);
//        List<Order> orders = (List<Order>)listForPage.get( "order" );
        return  listForPage;
    }


    @RequestMapping("/createJob")
    @ResponseBody
    public String  createJob(String jobName,String cronExpression)  {
        try {
            //进行测试所以写死
            jobName="test3";
            cronExpression="* 27 20 */1 * ?";

            QuartzBean quartzBean=new QuartzBean();
            quartzBean.setJobClass("com.kangyi.quartz.GuijiQuartz");
            quartzBean.setJobName(jobName);
            quartzBean.setCronExpression(cronExpression);
            quartzBeanService.insertOne( quartzBean );
            QuartzUtils.createScheduleJob(scheduler,quartzBean);
        } catch (Exception e) {
            return "创建失败";
        }
        return "创建成功";
    }


    @RequestMapping("/pauseJob")
    @ResponseBody
    public String  pauseJob(int jobId)  {
        try {
            QuartzBean quartzBean = quartzBeanService.selectOne( jobId );
            QuartzUtils.pauseScheduleJob (scheduler,quartzBean.getJobName());
        } catch (Exception e) {
            return "暂停失败";
        }
        return "暂停成功";
    }

    @RequestMapping("/delect")
    @ResponseBody
    public String  delect(int jobId)  {
        try {
            QuartzBean quartzBean = quartzBeanService.selectOne( jobId );
            QuartzUtils.deleteScheduleJob (scheduler,quartzBean.getJobName());
        } catch (Exception e) {
            return "删除失败";
        }
        return "删除成功";
    }

    @RequestMapping("/runOnce")
    @ResponseBody
    public String  runOnce(int jobId)  {
        try {
            QuartzBean quartzBean = quartzBeanService.selectOne( jobId );
            QuartzUtils.runOnce (scheduler,quartzBean.getJobName());
        } catch (Exception e) {
            return "运行一次失败";
        }
        return "运行一次成功";
    }

    @RequestMapping("/resume")
    @ResponseBody
    public String  resume(int jobId)  {
        try {
            QuartzBean quartzBean = quartzBeanService.selectOne( jobId );
            QuartzUtils.resumeScheduleJob(scheduler,quartzBean.getJobName());
        } catch (Exception e) {
            return "启动失败";
        }
        return "启动成功";
    }

    @RequestMapping("/update")
    @ResponseBody
    public String  update(String jobName,String cronTime,int jobId)  {
        //进行测试所以写死
//            quartzBean.setJobName("test1");
//            quartzBean.setCronExpression("10 * * * * ?");
        QuartzBean quartzBean = new QuartzBean();
        quartzBean.setJobName( jobName );
        quartzBean.setId( jobId );
        quartzBean.setCronExpression( cronTime );
        quartzBean.setJobClass("com.hjljy.blog.Quartz.GuijiQuartz");
        quartzBeanService.updateOne( quartzBean );
        try {

            QuartzUtils.updateScheduleJob(scheduler,quartzBean);
        } catch (Exception e) {
            return "修改启动失败";
        }
        return "修改启动成功";
    }
}