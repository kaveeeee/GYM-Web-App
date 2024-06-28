import React, { useState, useEffect } from "react";
import UserService from "../../Services/UserService";
import LikeService from "../../Services/LikeService";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import CommentService from "../../Services/CommentService";
import {
  SendOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  LikeOutlined,
  DislikeOutlined,
} from "@ant-design/icons";
import {
  Button,
  Modal,
  List,
  Row,
  Input,
  Col,
  Avatar,
  Dropdown,
  Menu,
  message,
} from "antd";
import PostService from "../../Services/PostService";
import CommentCard from "./CommentCard";
const FriendsPost = ({ post }) => {
  const snap = useSnapshot(state);
  const [userData, setUserData] = useState();
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [commentAdding, setCommentAdding] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [updatingCommentText, setUpdatingCommentText] = useState();
  const [updatingCommentId, setUpdatingCommentId] = useState();
  const [commentUploading, setCommentUploading] = useState(false);
  const [commentDeleting, setCommentDeleting] = useState(false);
  const [editFocues, setEditFocused] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState();
  const updatePost = () => {
    state.selectedPost = post;
    state.updatePostModalOpened = true;
  };
  const menu = (
    <Menu>
      <Menu.Item onClick={updatePost} key="edit">
        Edit
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          deletePost();
        }}
        key="delete"
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const deletePost = async () => {
    try {
      await PostService.deletePost(post.id);
      state.posts = await PostService.getPosts();
      message.success("Post deleted succesfully");
    } catch {}
  };

  const updateComment = async (id) => {
    try {
      setCommentUploading(true);
      console.log(`going to update ${updatingCommentId}`);
      await CommentService.updateComment(id, {
        commentText: updatingCommentText,
      });
      await getCommentsRelatedToPost();
      updatingCommentText("");
    } catch (error) {
    } finally {
      setCommentUploading(false);
    }
  };

  const deleteComment = async (id) => {
    try {
      setCommentDeleting(true);
      await CommentService.deleteComment(id);
      await getCommentsRelatedToPost();
    } catch (error) {
    } finally {
      setCommentDeleting(false);
    }
  };

  useEffect(() => {
    UserService.getProfileById(post.userId)
      .then((value) => {
        setUserData(value);
      })
      .catch((err) => {
        console.log(`error getting user data ${err}`);
      });
    getLikesRelatedToPost();
    getCommentsRelatedToPost();
  }, [post]);

  const getLikesRelatedToPost = async () => {
    try {
      const result = await LikeService.getLikesByPostId(post.id);
      setLikes(result);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const getCommentsRelatedToPost = async () => {
    try {
      const result = await CommentService.getCommentsByPostId(post.id);
      setComments(result);
    } catch (error) {}
  };
  const handleLike = async () => {
    try {
      await LikeService.createLike(
        {
          postId: post.id,
          userId: snap.currentUser?.uid,
        },
        snap.currentUser?.username,
        post.userId
      );
      // Refresh likes after successful like
      getLikesRelatedToPost();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnlike = async () => {
    try {
      // Find the like associated with the current user and remove it
      const likeToRemove = likes.find(
        (like) => like.userId === snap.currentUser?.uid
      );
      if (likeToRemove) {
        await LikeService.deleteLike(likeToRemove.id);
        // Refresh likes after successful unlike
        getLikesRelatedToPost();
      }
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const createComment = async () => {
    if (comment) {
      try {
        setCommentAdding(true);
        const body = {
          postId: post.id,
          userId: snap.currentUser?.uid,
          commentText: comment,
        };
        await CommentService.createComment(
          body,
          snap.currentUser?.username,
          snap.currentUser?.uid
        );
        setComment("");
        await getCommentsRelatedToPost();
      } catch (error) {
      } finally {
        setCommentAdding(false);
      }
    }
  };

  return (
    <div className="friends_post">
      <div className="friend_post_top">
        <div className="img_and_name">
          <img
            onClick={() => {
              if (userData?.profileVisibility) {
                state.selectedUserProfile = userData;
                state.friendProfileModalOpened = true;
              } else {
                message.info("Profile is locked");
              }
            }}
            alt="alt-tag"
            src={userData?.image}
          />
          <div className="friends_name">
            <p className="friends_name">{userData?.username}</p>
          </div>
        </div>
        {post.userId === snap.currentUser?.uid && (
          <Dropdown overlay={menu} placement="bottomRight">
            <Button>
              <MoreOutlined />
            </Button>
          </Dropdown>
        )}
      </div>
      {post.contentDescription && (
        <p style={{ color: "white" }}>{post.contentDescription}</p>
      )}
      {post.mediaType === "image" && (
        <img
          style={{
            maxWidth: "100%",
            minWidth: "100%",
            maxHeight: 600,
            minHeight: 500,
          }}
          alt="alt-tag"
          src={post?.mediaLink}
        />
      )}
      {post.mediaType === "video" && (
        <video
          style={{
            maxWidth: "100%",
            minWidth: "100%",
            maxHeight: 600,
            minHeight: 500,
          }}
          controls
          src={post?.mediaLink}
        />
      )}
      <div className="info">
        <div className="comment">
          <div className="like">
            {!likes.some((like) => like.userId === snap.currentUser?.uid) ? (
              <Button className="like_icon" onClick={handleLike}>
                <LikeOutlined />
              </Button>
            ) : (
              <Button className="like_icon" onClick={handleUnlike}>
                <DislikeOutlined />
              </Button>
            )}
          </div>
          <p style={{ cursor: "pointer", color: "white" }}>
            {likes.length} Likes
          </p>
          <p
            onClick={() => {
              setShowCommentModal(true);
            }}
            style={{ cursor: "pointer", color: "white" }}
          >
            {comments.length} Comments
          </p>
        </div>
      </div>
      <hr />

      <hr />
      <div className="comment_warpper">
        <img alt="alt-tag" src={snap.currentUser?.image} />

        <div className="comment_search">
          <input
            onChange={(e) => {
              setComment(e.target.value);
            }}
            type="text"
            style={{ color: "black" }}
            placeholder="Write a comment"
          />
        </div>
        <Button
          disabled={!comment}
          loading={commentAdding}
          onClick={createComment}
        >
          <SendOutlined color="white" style={{ color: "white" }} />
        </Button>
      </div>
      <hr />
      <Modal
        open={showCommentModal}
        footer={null}
        onCancel={() => {
          setShowCommentModal(false);
          setEditFocused(false);
        }}
      >
        <h1>Comments</h1>
        {comments.map((comment) => {
          const c = comment.commentText;
          if (comment.userId !== snap.currentUser.uid) {
            return <CommentCard comment={comment} key={comment.id} />;
          }
          if (comment.userId === snap.currentUser.uid) {
            return (
              <Row justify={"space-between"} style={{ marginBottom: 4 }}>
                <Col span={19}>
                  {editFocues && selectedCommentId === comment.id ? (
                    <Input
                      onChange={(e) => {
                        setUpdatingCommentId(comment.id);
                        setUpdatingCommentText(e.target.value);
                      }}
                      placeholder={c}
                    />
                  ) : (
                    <List.Item
                      style={{ display: "flex", gap: 16 }}
                      key={comment.id}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={snap.currentUser?.image} />}
                      />
                      {comment.commentText}
                      <Button
                        type="text"
                        onClick={() => {
                          setSelectedCommentId(comment.id);
                          setEditFocused(true);
                        }}
                      >
                        <MoreOutlined />
                      </Button>
                    </List.Item>
                  )}
                </Col>
                {editFocues && selectedCommentId === comment.id && (
                  <div>
                    <Button
                      onClick={() => {
                        updateComment(comment.id);
                      }}
                      loading={commentUploading}
                      type="dashed"
                    >
                      <EditOutlined />
                    </Button>

                    <Button
                      loading={commentDeleting}
                      onClick={() => {
                        deleteComment(comment.id);
                      }}
                      danger
                    >
                      <DeleteOutlined />
                    </Button>
                  </div>
                )}
              </Row>
            );
          }
          if (post.userId === snap.currentUser.uid) {
            <Button
              loading={commentDeleting}
              onClick={() => {
                deleteComment(comment.id);
              }}
              danger
            >
              <DeleteOutlined />
            </Button>;
          }
        })}
      </Modal>
    </div>
  );
};

export default FriendsPost;
