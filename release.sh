#!/bin/bash
# 发布前端静态资源重启服务脚本
# sh release.sh floder(floder可选，默认为当前日期)

floder=`date +%F`
if [ -n "$1" ];then
    floder=$1
fi
cd ./webapp
echo "---------git pull------------------------------------"
git checkout release
git pull
echo "---------/git pull-----------------------------------"

cd ../

if [ -d $floder ];then
    read -p '============目录已经存在，确定要继续吗？===========(y/n): ' answer
    case $answer in
    Y | y)
        echo "----------------continue----------------------";;
        #rm -rf ./$floder
    N | n)
        echo "----------------quit--------------------------"
        exit
    esac
fi
echo "---------------- copy --------------------"
cp ./webapp ./$floder -r
echo "---------------- /copy -------------------"
cd $floder
gulp cdn
pm2 delete webapp
pm2 start dependencies/pm2-config.json