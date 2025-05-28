const cnQuestions = [
    {
      question: "1. Internet的前身是( )。",
      options: ["A. ARPANET", "B. ChinaNet", "C. USNet", "D. CERNET"],
      answer: 0,
      explanation: "Internet起源于美国的ARPANET（阿帕网），它是最早的分组交换网络。"
    },
    {
      question: "2. 计算机互联的主要目的是( )。",
      options: ["A. 制定网络协议", "B. 将计算机技术与通信技术相结合", "C. 集中计算", "D. 信息传递与资源共享"],
      answer: 3,
      explanation: "计算机互联的根本目的是信息传递与资源共享。"
    },
    {
      question: "3. 网络和网络之间相连接，必需的设备是( )。",
      options: ["A. 网卡", "B. 调制解调器", "C. 防火墙", "D. 路由器"],
      answer: 3,
      explanation: "路由器用于连接不同网络，实现互联互通。"
    },
    {
      question: "4. 计算机网络上的第一个应用是( )。",
      options: ["A. 网络电话", "B. 文件传输", "C. 电子邮件", "D. 网络视频"],
      answer: 2,
      explanation: "电子邮件是最早被广泛应用的网络服务。"
    },
    {
      question: "5. IPv4的IP地址长度为多少字节？",
      options: ["A. 1个字节", "B. 2个字节", "C. 4个字节", "D. 8个字节"],
      answer: 2,
      explanation: "IPv4地址由32位组成，等于4个字节。"
    },
    {
      question: "6. 三级结构的因特网中不存在的是( )。",
      options: ["A. 主干ISP", "B. 地区ISP", "C. 区域ISP", "D. 本地ISP"],
      answer: 2,
      explanation: "常见的三级ISP结构是主干ISP、地区ISP、本地ISP，并无区域ISP一说。"
    },
    {
      question: "7. 以下哪种交换方式的传输效率可能比较低？",
      options: ["A. 采用短报文的报文交换", "B. 采用长报文的报文交换", "C. 采用长分组的分组交换", "D. 采用短分组的分组交换"],
      answer: 1,
      explanation: "长报文报文交换在网络中需要整体存储和转发，延迟大，效率低。"
    },
    {
      question: "8. 下列交换技术中，节点不采用‘存储-转发’方式的是( )。",
      options: ["A. 电路交换技术", "B. 报文交换技术", "C. 虚电路交换技术", "D. 数据报交换技术"],
      answer: 0,
      explanation: "电路交换建立专用通道后直接传输数据，不使用‘存储-转发’机制。"
    },
    {
      question: "9. 下列不是计算机网络核心部分设备的是( )。",
      options: ["A. 交换机", "B. 集线器", "C. 路由器", "D. 服务器"],
      answer: 1,
      explanation: "集线器属于物理层设备，不具备路由转发能力，核心功能较弱。"
    },
    {
      question: "10. 下面说法正确的是：",
      options: ["A. 在网络核心部分起特殊作用的是交换机", "B. 交换机是实现分组交换的关键构件", "C. 在网络核心部分起特殊作用的是路由器", "D. 路由器是实现分组交换的关键构件"],
      answer: [2, 3],
      explanation: "网络核心设备是路由器，它负责分组转发与路径选择。"
    },
    {
        question: "11. 如果要减少网络时延，实践中可以对哪种时延进行处理？",
        options: [
          "A. 发送时延",
          "B. 传播时延",
          "C. 处理时延",
          "D. 排队时延"
        ],
        answer: [0, 2, 3],
        explanation: "发送时延、处理时延、排队时延可以通过提升设备性能和优化排队机制减少，传播时延受物理距离影响较难优化。"
      },
      {
        question: "12. 排队时延发生在主机或路由器：",
        options: [
          "A. 向链路发送数据时",
          "B. 内部处理数据时",
          "C. 存储转发数据时",
          "D. 数据在链路上传播时"
        ],
        answer: 0,
        explanation: "排队时延是指分组在输出队列中等待被发送到链路的时延。"
      },
      {
        question: "13. 以下是专用网络的是：",
        options: [
          "A. 校园网",
          "B. 银行网",
          "C. 电信网",
          "D. 军事网"
        ],
        answer: [0, 1, 3],
        explanation: "校园网、银行网、军事网均为专用网络，电信网为公众通信网络。"
      },
      {
        question: "14. 教育科研网的英文表示是( )。",
        options: [
          "A. Cernet",
          "B. Ethernet",
          "C. ARPAnet",
          "D. Intranet"
        ],
        answer: 0,
        explanation: "CERNET 是中国教育科研网的英文缩写。"
      },
      {
        question: "15. 计算机网络分为局域网和广域网，其分类依据是( )。",
        options: [
          "A. 网络的地理覆盖范围",
          "B. 网络的传输介质",
          "C. 网络的拓扑结构",
          "D. 网络的成本价格"
        ],
        answer: 0,
        explanation: "局域网与广域网的划分依据是网络的地理覆盖范围。"
      },
      {
        question: "16. ( )是描述数据传输系统的重要指标，在数值上等于每秒钟传输的比特数。",
        options: [
          "A. 带宽",
          "B. 数据率",
          "C. 误码率",
          "D. 以上都不对"
        ],
        answer: 1,
        explanation: "数据率是指每秒传输的比特数，是描述传输能力的重要指标。"
      },
      {
        question: "17. 无线局域网的英文缩写是( )。",
        options: [
          "A. WAN",
          "B. MAN",
          "C. LAN",
          "D. WLAN"
        ],
        answer: 3,
        explanation: "WLAN（Wireless Local Area Network）表示无线局域网。"
      },
      {
        question: "18. 在OSI参考模型中，( )处于模型的最底层。",
        options: [
          "A. 运输层",
          "B. 物理层",
          "C. 数据链路层",
          "D. 网络层"
        ],
        answer: 1,
        explanation: "物理层是OSI参考模型的最底层，负责比特流的传输。"
      },
      {
        question: "19. 在下面给出的协议中，( )是TCP/IP的应用层协议。",
        options: [
          "A. TCP/FTP",
          "B. IP/UDP",
          "C. ARP/DNS",
          "D. DNS/SMTP"
        ],
        answer: 3,
        explanation: "DNS和SMTP都是TCP/IP体系结构的应用层协议。"
      },
      {
        question: "20. 服务与协议是完全不同的两个概念，下列说法错误的是( )。",
        options: [
          "A. 协议是水平的，即协议是控制对等实体间通信的规则。",
          "B. 服务是垂直的，即服务是下层向上层通过层间接口提供的。",
          "C. 本层协议的实现必须得到向下一层提供的服务。",
          "D. OSI将层与层之间交换的数据单位称为协议数据单元PDU"
        ],
        answer: 3,
        explanation: "OSI将协议数据单元（PDU）定义为同层间交互的数据单位，层与层之间交换的是服务数据单元（SDU）。"
      },
      {
        question: "21. 在OSI参考( )的数据传送单位是比特。",
        options: [
          "A. 物理层",
          "B. 数据链路层",
          "C. 网络层",
          "D. 传输层"
        ],
        answer: 0,
        explanation: "物理层传送的基本单位是比特。"
      },
      {
        question: "22. 学校的校园网络属于( )。",
        options: [
          "A. 局域网",
          "B. 广域网",
          "C. 城域网",
          "D. 电话网"
        ],
        answer: 0,
        explanation: "校园网覆盖范围通常较小，属于局域网。"
      },
      {
        question: "23. Internet的核心是( )协议。",
        options: [
          "A. TCP",
          "B. TCP/IP",
          "C. ICMP",
          "D. IP"
        ],
        answer: 1,
        explanation: "TCP/IP协议族是Internet的核心协议。"
      },
      {
        question: "24. 电话、电报和QQ视频电话分别使用的数据交换技术是( )。",
        options: [
          "A. 电路交换技术、报文交换技术和分组交换技术",
          "B. 分组交换技术、报文交换技术和电路交换技术",
          "C. 报文交换技术、分组交换技术和电路交换技术",
          "D. 电路交换技术、分组交换技术和报文交换技术"
        ],
        answer: 0,
        explanation: "电话采用电路交换，电报采用报文交换，QQ视频电话采用分组交换。"
      },
      {
        question: "25. 计算机网络中，分层和协议的集合称为计算机网络的( )。",
        options: [
          "A. 体系结构",
          "B. 组成结构",
          "C. TCP/IP模型",
          "D. ISO/OSI网"
        ],
        answer: 0,
        explanation: "计算机网络的分层和协议集合称为网络的体系结构。"
      },
      {
        question: "26. 在TCP/IP的进程之间进行通信经常使用客户/服务器方式，下面关于客户和服务器的描述，正确的是( )。",
        options: [
          "A. 是指通信中所涉及的两种硬件机器。",
          "B. 描述的是进程之间服务与被服务的关系。",
          "C. 服务器是服务请求方，客户是服务提供方。",
          "D. 一个客户程序可与多个服务器进行通信"
        ],
        answer: 1,
        explanation: "客户和服务器描述的是进程之间服务与被服务的关系。"
      },
      {
        question: "27. 以下关于网络的说法错误的是( )。",
        options: [
          "A. 将两台电脑用网线联在一起就是一个网络",
          "B. 网络按覆盖范围可以分为LAN、MAN和WAN",
          "C. 计算机网络有数据通信、资源共享和分布处理等功能",
          "D. 上网时我们享受的服务不只是眼前的工作站提供的"
        ],
        answer: 0,
        explanation: "两台电脑连接只能称为互联，不能称为完整的网络。"
      },
      {
        question: "28. 两个不同的计算机类型能通信，如果它们( )。",
        options: [
          "A. 使用相同的文件格式",
          "B. 都使用TCP/IP",
          "C. 都是兼容的协议组",
          "D. 一个是Macintosh，一个是Unix站"
        ],
        answer: 2,
        explanation: "不同类型的计算机只要协议兼容就能通信。"
      },
      {
        question: "29. 帧是在( )传输的PDU。",
        options: [
          "A. 物理层",
          "B. 数据链路层",
          "C. 网络层",
          "D. 传输层"
        ],
        answer: 1,
        explanation: "数据链路层传输的数据单位是帧（Frame）。"
      },
      {
        question: "30. 用户数据报是在( )传输的PDU。",
        options: [
          "A. 物理层",
          "B. 数据链路层",
          "C. 网络层",
          "D. 运输层"
        ],
        answer: 3,
        explanation: "运输层的数据单位是用户数据报（Segment/UDP Datagram）。"
      }
  ];
  
