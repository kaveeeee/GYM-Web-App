import { Avatar, Tabs } from "antd";
import React, { useEffect } from "react";
import { useSnapshot } from "valtio";
import PostService from "../../Services/PostService";
import "../../Styles/center_section.css";
import state from "../../Utils/Store";
import CreaetMealPlanBox from "./CreaetMealPlanBox";
import CreateWorkoutPlanBox from "./CreateWorkoutPlanBox";
import FriendsPost from "./FriendsPost";
import FriendsSection from "./FriendsSection";
import MealPlanCard from "./MealPlanCard";
import MyPost from "./MyPost";
import TobBox from "./TobBox";
import WorkoutPlanCard from "./WorkoutPlanCard";

const { TabPane } = Tabs;
const CenterSection = () => {
  const snap = useSnapshot(state);
  useEffect(() => {
    PostService.getPosts()
      .then((resul) => {
        state.posts = resul;
      })
      .catch((err) => {});
  }, []);
  
  return (
    <div class="center">
      <nav
        style={{
          height: 70,
          width: "100%",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1.5rem",
            fontWeight: 600,
          }}
        >
          <img style={{ maxHeight: 40 }} src="assets/logo.png" alt="logo" />
          PowerPlus+
        </div>
        <Avatar
          style={{ cursor: "pointer", border: "5px solid pink" }}
          onClick={() => {
            state.profileModalOpend = true;
          }}
          size={70}
          src={snap.currentUser?.image}
        />
      </nav>
      <TobBox />
      <Tabs defaultActiveKey="1">
        <TabPane tab="Media Sharing" key="1">
          <MyPost />
          <div>
            {snap.posts.map((post) => {
              return <FriendsPost key={post?.id} post={post} />;
            })}
          </div>
        </TabPane>
        <TabPane tab="Workout Plans" key="2">
          <CreateWorkoutPlanBox />
          <div>
            {snap.workoutPlans.map((plan) => (
              <WorkoutPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </TabPane>
        <TabPane tab="Meal Plans" key="3">
          <CreaetMealPlanBox />
          <div>
            {snap.mealPlans.map((plan) => (
              <MealPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </TabPane>
        <TabPane tab="Friends" key={"4"}>
          <FriendsSection />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CenterSection;
