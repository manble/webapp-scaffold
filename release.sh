#!/bin/bash
# 简单的发布工程脚本
# 将此脚本放在发布工程的根目录下
# sh release.sh floder(floder可选，默认为当前日期)

floder=`date +%F`
if [ -n "$1" ];then
    floder=$1
fi
cd ~/app
if [ -d $floder ];then
    read -p '============目录已经存在，确定要继续吗？===========(y/n): ' answer
    case $answer in
    Y | y)
        echo "----------------continue----------------------";;
        git reset --hard 
        git checkout master
        git pull
    N | n)
        echo "----------------quit--------------------------"
        exit
    esac
else
    echo "---------git clone------------------------------------"
    git clone https://example.com/manble/webapp.git $floder
    echo "---------/git clone-----------------------------------"
fi

cd $floder
export NODE_ENV=production
npm install
gulp production
pm2 delete webapp
pm2 start pm2-config.json