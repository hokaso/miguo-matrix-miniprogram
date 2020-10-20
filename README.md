# 小程序前端

详细说明：https://hocassian.cn/archives/tech/7895/

针对活动直播与互动相关的需求，我们最终决定通过设计一个集成各项互动交流业务于一身的小程序来实现，图3-7展示了小程序的大致设计与布局，具体功能模块如下：
### (1) 投票模块。
用户通过直播浏览活动中的参演单位，为自己喜爱的对象投票。其中用户可以点击某一特定对象进入详情页面，更深入地了解当前对象的背景信息；当用户决定为该项目投票时，点击对应投票按钮，若此为该用户第一次投票，即为相应对象增加一票；若非首次投票，则拒绝用户的重复投票。此外，还设计该模块具备防止恶意刷票的功能。
### (2) 公告展示。
根据活动流程按时间显示当下环节的相关信息，展示该环节的名称和简介，历史公告将按时间逆序排序。支持到点自动刷新，实时更新公告内容。
### (3) 活动直播。
通过桥接腾讯新闻APP后端的内部推流接口，为用户提供稳定的直播视频流，未来版本迭代中将会添加发送弹幕的功能。
### (4) 赞助商展示。
为活动赞助商留下的一席之地，精简展示赞助商推广信息，并通过将观众引导至对应微信公众号主页的方式间接实现招商引流。

![小程序缩览图](https://hocassian.cn/download/migo_miniprogram.jpg)
