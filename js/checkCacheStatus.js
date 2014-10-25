/**
 * Created by zhao on 2014/10/24.
 */
//检测本地存储状态
onmessage = function(e){
    function checkCacheStatus(){
        var sCacheStatus = "不支持应用程序缓存";
        if (e.data)
        {
            var oAppCache = parseInt(e.data);
            console.log(oAppCache);
            switch ( oAppCache )
            {
                case 0 :
//                case oAppCache.UNCACHED :
                    sCacheStatus = "未缓存";
                    break;
                case 1 :
//                case oAppCache.IDLE :
                    sCacheStatus = "已缓存";
                    break;
                case 2 :
//                case oAppCache.CHECKING :
                    sCacheStatus = "检查中";
                    break;
                case 3 :
//                case oAppCache.DOWNLOADING :
                    sCacheStatus = "下载中";
                    break;
                case 4 :
//                case oAppCache.UPDATEREADY :
                    sCacheStatus = "已更新";
                    break;
                case 5 :
//                case oAppCache.OBSOLETE :
                    sCacheStatus = "已作废";
                    break;
                default :
                    sCacheStatus = "意外的状态 ( " +
                        oAppCache + ")";
                    break;
            }
        }
        postMessage(sCacheStatus);
    }

    checkCacheStatus();
};
