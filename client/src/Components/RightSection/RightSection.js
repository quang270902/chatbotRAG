import { useEffect, useRef, useState } from "react";
import { CautionIcon, LightningChargeIcon, SunIcon } from "../../constants";
import Footer from "../Footer/Footer";
import { Avatar, Button, Modal } from "flowbite-react";
import botAvatar from "../../assets/images/bot.png";
import "./right-section.css";
import TypingEffect from "../TypingEffect/TypingEffect";

const RightSection = (props) => {
  const [openContextModal, setOpenContextModal] = useState(false);
  const [message, setMessage] = useState();

  useEffect(() => {
    var chatSection = document.getElementById("chat-container");
    chatSection.scrollTop = 9999999999999;
  }, []);

  const typing = (message) => {
    var i = 0;
    var speed = 50;

    if (i < message.length) {
      document.getElementById("demo").innerHTML += message.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  };

  return (
    <div className="flex max-h-full flex-1 flex-col">
      <main className="relative h-screen w-full transition-width flex flex-col items-stretch bg-white">
        <div className="flex-1 pb-6">
          <div
            className="flex right-section overflow-auto flex-col items-center text-sm h-full md:h-[80vh] bg-white"
            id="chat-container"
          >
            <div
              className={`text-gray-800  w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 mt-10 ${
                props.chatHistory.length > 0 ? "!hidden" : ""
              }`}
            >
              <h1 className="text-4xl text-black font-semibold text-center ml-auto mr-auto my-10">
                CHATBOT LUẬT PHÁP VIỆT NAM
              </h1>
              <div className="md:flex items-start text-center gap-3.5 text-black">
                {[
                  {
                    icon: <SunIcon />,
                    title: "Câu hỏi mẫu",
                    subTitle: [
                      `"Tôi muốn biết rằng khi ly hôn tài sản giữa vợ và chồng được chia như thế nào?" →`,
                      `"Tình huống: Trong một vụ án hình sự, bị cáo không đồng ý với kết quả giám định tư pháp và yêu cầu giám định lại. Trong trường hợp này, quy định pháp luật về việc yêu cầu giám định lại là gì và quy trình thực hiện như thế nào?" →`,
                      ,
                    ],
                    hover: true,
                  },
                  {
                    icon: <LightningChargeIcon />,
                    title: "Khả năng",
                    subTitle: [
                      `Ghi nhớ được ngữ cảnh của đoạn hội thoại để đưa ra câu trả lời phù hợp.`,
                      `Dự liệu về Pháp Luật được cập nhật dựa trên trang chủ Pháp Luật Việt Nam.`,
                      `Được huấn luyện để có thể từ chối được các yêu cầu không phù hợp.`,
                    ],
                    hover: true,
                  },
                  {
                    icon: <CautionIcon />,
                    title: "Giới hạn",
                    subTitle: [
                      `Thỉnh thoảng có thể tạo thông tin không chính xác và đã hạn chế, khi mà với thông tin không đầy đủ chatbot sẽ thông báo "Tôi không biết".`,
                      `Thỉnh thoảng có thể tạo ra nội dung thiên vị`,
                      `Thỉnh thoảng có thể tạo ra nội dung thiên vị`,
                    ],
                    hover: true,
                  },
                ].map((item, index) => (
                  <div
                    className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1"
                    key={index}
                  >
                    <h2 className="flex gap-3 text-black  items-center m-auto text-lg font-normal md:flex-col md:gap-2">
                      {item.icon}
                      {item.title}
                    </h2>
                    <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                      {item.subTitle.map((subTitle, subTitleIndex) => (
                        <button
                          className={`w-full bg-gray-50 text-black bg-white/5 p-3 rounded-md ${
                            item.hover
                              ? "hover:bg-gray-200 dark:hover:bg-gray-900 cursor-pointer"
                              : "cursor-text"
                          }`}
                          key={subTitleIndex}
                        >
                          {subTitle}
                        </button>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-2/3 mt-5 px-7 flex flex-col space-y-10 flex-shrink-0">
              <div>
                {props.chatHistory.map((item, index) => (
                  <div className="flex flex-col space-y-10" key={index}>
                    <div className="max-w-[70%] ml-auto flex space-x-2 items-end">
                      <p
                        className="text-black bg-sky-200 p-5 ml-auto inline-block 
                      px-3 py-2.5 rounded-l-3xl rounded-tr-3xl text-base tracking-normal leading-normal text-justify"
                      >
                        {item.User}
                      </p>

                      <Avatar img="" alt="User" rounded className="shrink-0" />
                    </div>

                    {index < props.chatHistory.length - 1 ? (
                      <>
                        {item.Bot && (
                          <div className="flex space-x-2 items-end">
                            <Avatar
                              img={botAvatar}
                              alt="User"
                              rounded
                              className="shrink-0"
                            />

                            <p className="w-full bg-gray-100 text-black rounded-r-3xl rounded-tl-3xl text-justify p-5 ml-auto text-base tracking-normal leading-normal">
                              {item.Bot}
                              {(item.Context1 || item.Context2) && (
                                <>
                                  <br />
                                  <span
                                    className="text-right block font-medium mt-2 hover:text-gray-600 hover:underline cursor-pointer"
                                    onClick={() => {
                                      setMessage(item);
                                      setOpenContextModal(true);
                                    }}
                                  >
                                    Xem chi tiết điều luật
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex space-x-2 items-end">
                          <Avatar
                            img={botAvatar}
                            alt="User"
                            rounded
                            className="shrink-0"
                          />

                          {item.Bot && (
                            <>
                              {props.isBotReplying ? (
                                <>
                                  <TypingEffect
                                    text={item.Bot}
                                    context={
                                      <>
                                        {(item.Context1 || item.Context2) && (
                                          <>
                                            <br />
                                            <span
                                              className="text-right block font-medium mt-2 hover:text-gray-600 hover:underline cursor-pointer"
                                              onClick={() => {
                                                setMessage(item);
                                                setOpenContextModal(true);
                                              }}
                                            >
                                              Xem chi tiết điều luật
                                            </span>
                                          </>
                                        )}
                                      </>
                                    }
                                  />
                                </>
                              ) : (
                                <p className="w-full bg-gray-100 text-black rounded-r-3xl rounded-tl-3xl text-justify p-5 ml-auto text-base tracking-normal leading-normal">
                                  {item.Bot}
                                  {(item.Context1 || item.Context2) && (
                                    <>
                                      <br />
                                      <span
                                        className="text-right block font-medium mt-2 hover:text-gray-600 hover:underline cursor-pointer"
                                        onClick={() => {
                                          setMessage(item);
                                          setOpenContextModal(true);
                                        }}
                                      >
                                        Xem chi tiết điều luật
                                      </span>
                                    </>
                                  )}
                                </p>
                              )}
                            </>
                          )}

                          {props.isProcessing && (
                            <div className="loader mb-3" />
                          )}
                        </div>
                      </>
                    )}

                    <div className="w-full h-[0.1px] bg-white"></div>
                  </div>
                ))}

                <Modal
                  size="3xl"
                  show={openContextModal}
                  onClose={() => setOpenContextModal(false)}
                >
                  <Modal.Header>Điều Luật tham khảo</Modal.Header>
                  <Modal.Body>
                    <div className="space-y-6">
                      <div>
                        <p className="font-medium text-lg">Điều luật 1</p>

                        <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400 text-justify">
                          {message && message.Context1}
                        </p>
                      </div>

                      <div>
                        <p className="font-medium text-lg">Điều luật 2</p>

                        <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400 text-justify">
                          {message && message.Context2}
                        </p>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      onClick={() => setOpenContextModal(false)}
                      className="ml-auto"
                      color="success"
                    >
                      OK
                    </Button>
                  </Modal.Footer>
                </Modal>

                <div id="end-chat" />
              </div>
            </div>
          </div>
        </div>
        <Footer
          /* setQuestionData={props.setQuestionData}
          call={props.call}*/
          userInput={props.userInput}
          chatHistory={props.chatHistory}
          setUserInput={props.setUserInput}
          handleUserInput={props.handleUserInput}
          handleInputChange={props.handleInputChange}
          handleKeyDown={props.handleKeyDown}
          textareaRef={props.textareaRef}
          isProcessing={props.isProcessing}
        />
      </main>
    </div>
  );
};

export default RightSection;
