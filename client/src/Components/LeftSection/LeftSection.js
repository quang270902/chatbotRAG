import React, { useEffect, useRef, useState } from "react";
import { PlusIcon } from "../../constants";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegTrashCan } from "react-icons/fa6";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { Avatar, Button, Modal, Popover, Tooltip } from "flowbite-react";
import "./left-section.css";
import { RiErrorWarningFill } from "react-icons/ri";
import { Bounce, toast } from "react-toastify";
import axios from "axios";
import moment from "moment";

const toastOptions = {
  position: "top-center",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
  theme: "light",
  transition: Bounce,
};

const LeftSection = ({ conversations, refresh }) => {
  const { session_id } = useParams();
  const navigate = useNavigate();

  const titleRefs = useRef([]);

  const [conversation, setConversation] = useState();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editId, setEditId] = useState("");

  const onDeleteConversation = () => {
    axios
      .delete(
        process.env.REACT_APP_API_BASE_URL +
          "delete-conversation/" +
          (conversation && conversation.Session_ID)
      )
      .then((response) => {
        if (response.status === 200) {
          refresh();

          navigate("/");

          toast.success("Xóa hội thoại thành công!", toastOptions);
        } else {
          toast.error("Đã xảy ra lỗi khi xóa hội thoại!", toastOptions);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the message list!", error);
      });
  };

  const onUpdateConversation = () => {
    axios
      .put(
        process.env.REACT_APP_API_BASE_URL +
          "update-conversation/" +
          (conversation && conversation.Session_ID),
        { title: conversation.Title }
      )
      .then((response) => {
        if (response.status === 200) {
          refresh();
        } else {
          toast.error("Đã xảy ra lỗi khi cập nhật hội thoại!", toastOptions);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the message list!", error);
      });
  };

  const setCaretToEnd = (el) => {
    el.focus();
    var range = document.createRange();
    var sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false); // Collapse to the end of the content
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const removeFocus = () => {
    if (editId) {
      const index = conversations.findIndex(
        (conv) => conv.Session_ID === editId
      );
      if (index !== -1 && titleRefs.current[index]) {
        titleRefs.current[index].blur();
        setEditId("");
      }
    }
  };

  const checkDate = (dateString) => {
    if (!dateString) {
      return <p className="ml-3 font-medium">Không xác định</p>;
    }

    const today = new Date(); // Ngày hiện tại
    const yesterday = new Date(today); // Ngày hôm qua
    yesterday.setDate(today.getDate() - 1);

    // Chuyển đổi chuỗi ngày thành đối tượng Date
    const date = new Date(dateString);

    // Chỉ lấy phần ngày (bỏ qua phần giờ phút giây)
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    // So sánh với ngày hiện tại, ngày hôm qua, và tuần trước (loại bỏ hôm nay và hôm qua)
    if (dateOnly.toDateString() === today.toDateString()) {
      return <p className="ml-3 font-medium">Hôm nay</p>;
    } else if (dateOnly.toDateString() === yesterday.toDateString()) {
      return <p className="ml-3 font-medium">Hôm qua</p>;
    } else {
      return (
        <p className="ml-3 font-medium ">
          Ngày {moment(dateString).format("DD/MM/YYYY")}
        </p>
      );
    }
  };

  return (
    <div className={`bg-white w-full h-screen overflow-auto rounded-3xl`}>
      {/* <div
      className={`${show && " flex flex-col"} ${
        !show && "hidden"
      } bg-white md:fixed md:inset-y-0 md:flex md:flex-col p-3 w-full`}
    ></div> */}
      <div className="scrollbar-trigger flex flex-col h-full w-full bg-gray-100 p-3 space-y-5">
        <Avatar img="" alt="Logo" className="" size="xl" />

        <div
          onClick={() => navigate("/")}
          className="w-fit h-fit m-auto flex px-5 py-3 items-center gap-3 hover:bg-gray-500/10 transition-colors bg-gray-200 duration-200 rounded-3xl text-black cursor-pointer text-sm mb-2 border"
        >
          <PlusIcon />
          Mới
        </div>
        {/* <div className="flex-col flex-1 overflow-y-auto border-b bg-gray-100">
              <div className="text-sm text-black mb-3 font-bold ">Hôm nay</div>
              <div className="text-sm text-black mb-3 cursor-pointer transition-colors duration-300 hover:bg-gray-800 p-2 rounded">
                Luật hôn nhân và gia đình
              </div>
              <div className="text-sm text-black mb-3 font-bold ">
                1 tuần trước
              </div>
              <div className="text-sm text-black mb-3 cursor-pointer transition-colors duration-300 hover:bg-gray-800 p-2 rounded">
                Tư vấn lao động
              </div>
              <div className="text-sm text-black mb-3 cursor-pointer transition-colors duration-300 hover:bg-gray-800 p-2 rounded">
                Flask Environment Development
              </div>
              <div className="text-sm text-black mb-3 cursor-pointer transition-colors duration-300 hover:bg-gray-800 p-2 rounded">
                JSON formatting error troublesho
              </div>
              <div className="text-sm text-black mb-3 cursor-pointer transition-colors duration-300 hover:bg-gray-800 p-2 rounded">
                Flask API for net.js
              </div>
              <div className="text-sm text-black mb-3 font-bold">
                1 tháng trước
              </div>
            </div> */}

        <div className="flex-col space-y-5 overflow-y-auto border-b bg-gray-100 w-full">
          {conversations &&
            conversations.map((range, index) => (
              <div className="" key={index}>
                <>{checkDate(range.date)}</>

                {range.conversations &&
                  range.conversations.map((conv, i) => (
                    <div
                      key={i}
                      className={`group block w-full h-fit text-black cursor-pointer transition-colors duration-300 hover:bg-gray-200 p-2 rounded-lg ${
                        conv.Session_ID === session_id ? "bg-gray-200" : ""
                      }`}
                    >
                      <div className="w-full flex items-center justify-between">
                        <div
                          ref={(el) => (titleRefs.current[index] = el)}
                          tabIndex="0"
                          className={`text-sm w-11/12 p-1 focus:outline-2 focus:outline-black focus:rounded-sm title-content ${
                            conv.Session_ID === editId ? "" : "truncate"
                          }`}
                          contentEditable={conv.Session_ID === editId}
                          onInput={(e) =>
                            setConversation({
                              ...conversation,
                              title: e.target.innerHTML,
                            })
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/c/${conv.Session_ID}`);
                          }}
                          onBlur={() => {
                            onUpdateConversation();
                            removeFocus();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              onUpdateConversation();
                              removeFocus();
                            }
                          }}
                        >
                          {conv.Title}
                        </div>

                        <div className="w-1/12 m-auto">
                          <Tooltip
                            placement="right"
                            trigger="click"
                            style="light"
                            content={
                              <>
                                <div
                                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 rounded-lg p-2"
                                  onClick={() => {
                                    refresh();
                                    setConversation(conv);
                                    setEditId(conv.Session_ID);
                                    const currentRef = titleRefs.current[index];
                                    currentRef.focus();
                                    setCaretToEnd(currentRef);
                                  }}
                                >
                                  <HiOutlinePencilAlt className="text-xl text-gray-500" />
                                  <p className="text-sm">Đổi tên</p>
                                </div>

                                <div
                                  className="flex items-center space-x-2 cursor-pointer text-red-500 hover:bg-red-200 rounded-lg p-2"
                                  onClick={() => {
                                    setConversation(conv);
                                    setOpenDeleteModal(true);
                                  }}
                                >
                                  <FaRegTrashCan className="text-lg" />
                                  <p className="text-sm">Xóa</p>
                                </div>
                              </>
                            }
                          >
                            <BsThreeDotsVertical
                              className="opacity-0 group-hover:opacity-100 right-0 text-lg rounded-lg z-10 shadow-2xl shadow-white bg-gray-200 text-gray-500 hover:text-gray-800"
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      </div>

      <Modal
        show={openDeleteModal}
        size="lg"
        onClose={() => setOpenDeleteModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <RiErrorWarningFill className="mx-auto mb-4 h-20 w-20 text-red-600" />
            <h3 className="mb-5 text-lg ">
              Bạn có chắc là muốn xóa đoạn chat{" "}
              <span className="font-semibold">
                {conversation && conversation.Title}
              </span>
            </h3>
            <div className="flex justify-center gap-4 mb-5">
              <Button
                color="failure"
                pill
                onClick={() => {
                  onDeleteConversation();
                  setOpenDeleteModal(false);
                }}
              >
                Chắc chắn
              </Button>
              <Button
                color="gray"
                pill
                onClick={() => setOpenDeleteModal(false)}
              >
                Hủy bỏ
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LeftSection;
