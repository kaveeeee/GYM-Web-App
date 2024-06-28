import React, { useState } from "react";
import {
  Modal,
  Upload,
  Input,
  Button,
  DatePicker,
  message,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import WorkoutStoryService from "../../Services/WorkoutStoryService";

const uploader = new UploadFileService();
const { Option } = Select;

const CreateWorkoutStoryModal = () => {
  const snap = useSnapshot(state);
  const [imageUploading, setImageUploading] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timestamp: null,
    exerciseType: "", // New field: Exercise Type
    timeDuration: 0, // New field: Time Duration
    intensity: "", // New field: Intensity Options
  });

  const handleCreateWorkoutStory = async () => {
    try {
      setLoading(true);
      const body = {
        ...formData,
        image,
        userId: snap.currentUser?.uid,
      };
      await WorkoutStoryService.createWorkoutStory(body);
      state.storyCards = await WorkoutStoryService.getAllWorkoutStories();
      message.success("Workout story created successfully");
      setFormData({
        title: "",
        description: "",
        timestamp: null,
        exerciseType: "", // New field: Exercise Type
        timeDuration: 0, // New field: Time Duration
        intensity: "", // New field: Intensity Options
      });
    } catch (error) {
      message.error("Error creating workout story");
    } finally {
      state.createWorkoutStatusModalOpened = false;
      setLoading(false);
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setImageUploading(true);
      const url = await uploader.uploadFile(
        info.fileList[0].originFileObj,
        "workoutStories"
      );
      setImage(url);
    } else if (info.file.status === "removed") {
    }
    setImageUploading(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      timestamp: date,
    });
  };

  const handleIntensityChange = (value) => {
    setFormData({
      ...formData,
      intensity: value,
    });
  };

  return (
    <Modal
      open={snap.createWorkoutStatusModalOpened}
      onCancel={() => {
        state.createWorkoutStatusModalOpened = false;
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => (state.createWorkoutStatusModalOpened = false)}
        >
          Cancel
        </Button>,
        <Button
          loading={loading}
          key="create"
          type="primary"
          onClick={handleCreateWorkoutStory}
        >
          Create
        </Button>,
      ]}
    >
      <h2>Create Workout Story</h2>
      <Input
        placeholder="Title"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        style={{ marginBottom: "1rem" }}
      />
      <DatePicker
        placeholder="Timestamp"
        style={{ marginBottom: "1rem", width: "100%" }}
        onChange={handleDateChange}
      />
      <Input
        placeholder="Exercise Type"
        name="exerciseType"
        value={formData.exerciseType}
        onChange={handleInputChange}
        style={{ marginBottom: "1rem" }}
      />
      <Input
        placeholder="Time Duration (in minutes)"
        type="number"
        name="timeDuration"
        value={formData.timeDuration}
        onChange={handleInputChange}
        style={{ marginBottom: "1rem" }}
      />
      <Select
        placeholder="Select Intensity"
        style={{ width: "100%", marginBottom: "1rem" }}
        onChange={handleIntensityChange}
        value={formData.intensity}
      >
        <Option value="No Efforts">No Efforts</Option>
        <Option value="Mid Efforts">Mid Efforts</Option>
        <Option value="Moderate Efforts">Moderate Efforts</Option>
        <Option value="Severe Efforts">Severe Efforts</Option>
        <Option value="Maximal Efforts">Maximal Efforts</Option>
      </Select>
      <Input.TextArea
        placeholder="Description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        style={{ marginBottom: "1rem" }}
      />
      {imageUploading ? (
        <p>Image is uploading</p>
      ) : (
        <Upload
          accept="image/*"
          onChange={handleFileChange}
          showUploadList={false}
          beforeUpload={() => false}
          style={{ marginBottom: "1rem" }}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
      )}
      {image && (
        <img
          src={image}
          alt="Uploaded"
          style={{ maxWidth: "100%", marginBottom: "1rem" }}
        />
      )}
    </Modal>
  );
};

export default CreateWorkoutStoryModal;
