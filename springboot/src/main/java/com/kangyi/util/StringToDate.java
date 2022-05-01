package com.kangyi.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class StringToDate {
    static public Date YMDToDate(String a){
        System.out.println("@@stringToDate "+a);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date date = null;
        if(a.trim().length()>0||a!=null){

            try {
                date = sdf.parse(a);
            } catch (ParseException e) {
                date = null;
                System.out.println("@#$ "+a+" 日期空的");

            }
        }
        return date;
    }

    static public Date YMDmsToDate(String a){
        System.out.println("@@stringToDate "+a);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = null;
        if(a.trim().length()>0||a!=null){

            try {
                date = sdf.parse(a);
            } catch (ParseException e) {
                date = null;
                System.out.println("@#$ "+a+" 日期空的");
            }
        }
        return date;
    }

    static public Date YMDmToDate(String a){
        System.out.println("@@stringToDate "+a);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        Date date = null;
        if(a.trim().length()>0||a!=null){

            try {
                date = sdf.parse(a);
            } catch (ParseException e) {
                date = null;
                System.out.println("@#$ "+a+" 日期空的");
            }
        }
        return date;
    }

    static public Date dateAddTian(Date d, int t){

        Calendar cal = Calendar.getInstance();
        cal.setTime(d);
        cal.add(Calendar.DATE, t);
        Date date =cal.getTime();
        return date;
    }

    static public String YNDhmNewDateString(){

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        String date =formatter.format( new Date() );
        return date;
    }
}
