import { Tabs } from "expo-router";
import MessageIconActive from "../../assets/icons/messageIconActive.jsx";
import MessageIconInactive from "../../assets/icons/messageIconInactive.jsx";
import StoryIconActive from "../../assets/icons/storyIconActive.jsx";
import StoryIconInactive from "../../assets/icons/storyIconInactive.jsx";
import NotifIconActive from "../../assets/icons/notifIconActive.jsx";
import NotifIconInactive from "../../assets/icons/notifIconInactive.jsx";
import ProfileIconActive from "../../assets/icons/profileIconActive.jsx";
import ProfileIconInactive from "../../assets/icons/profileIconInactive.jsx";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          position: "absolute",
          height: 80,
          width: "100%",
          backgroundColor: "black",
          borderTopWidth: 1,
          borderTopColor: "white",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarItemStyle: {
          paddingVertical: 15,
        },
        tabBarShowLabel: false,
      }}
    >

      <Tabs.Screen
        name="message"
        options={{
          title: "Message",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MessageIconActive width={24} height={24} />
            ) : (
              <MessageIconInactive width={24} height={24} />
            ),
        }}
      />

      <Tabs.Screen
        name="story"
        options={{
          title: "Story",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <StoryIconActive width={24} height={24} />
            ) : (
              <StoryIconInactive width={24} height={24} />
            ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notification",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <NotifIconActive width={24} height={22} />
            ) : (
              <NotifIconInactive width={24} height={22} />
            ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <ProfileIconActive width={24} height={24} />
            ) : (
              <ProfileIconInactive width={24} height={24} />
            ),
        }}
      />
    </Tabs>
  );
}
