/**
 * Created by zhao on 2014/10/24.
 */
//检测本地存储状态
onmessage = function(e){
    function checkCacheStatus(){
        var sCacheStatus = "不支持应用程序缓存";
        console.log(this);
        if (e.data)
        {
            var oAppCache = e.data;
            switch ( oAppCache.status )
            {
                case oAppCache.UNCACHED :
                    sCacheStatus = "未缓存";
                    break;
                case oAppCache.IDLE :
                    sCacheStatus = "空闲";
                    break;
                case oAppCache.CHECKING :
                    sCacheStatus = "检查中";
                    break;
                case oAppCache.DOWNLOADING :
                    sCacheStatus = "下载中";
                    break;
                case oAppCache.UPDATEREADY :
                    sCacheStatus = "已更新";
                    break;
                case oAppCache.OBSOLETE :
                    sCacheStatus = "已作废";
                    break;
                default :
                    sCacheStatus = "意外的状态 ( " +
                        oAppCache.status.toString() + ")";
                    break;
            }
        }

        postMessage(sCacheStatus);
        setTimeout("checkCacheStatus()",500);
    }

    checkCacheStatus();
};
