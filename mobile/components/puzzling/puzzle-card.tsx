import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { convertDate } from "@/app/(main)/user-profile";
import { Comment, Puzzle, Response } from "@/utils/types";
import { useUser } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import useApi from "@/utils/api";
import { useAppUser } from "@/hooks/useAppUser";
import { ReactNativeModal } from "react-native-modal";
import { toast } from "@/utils/utils";

type PuzzleCardProps = {
  item: Puzzle;
  width: number;
};

export type Result = {
  isCorrect: boolean;
  text: string | null;
};

const PuzzleCard = ({ item, width }: PuzzleCardProps) => {
  const api = useApi();
  const { colors } = useTheme();
  const { user } = useUser();
  const { fetchUserSettings } = useAppUser();

  const [likes, setLikes] = useState(item.likes);
  const [dislikes, setDislikes] = useState(item.dislikes);
  const [comments, setComments] = useState<Comment[]>(item.comments);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showPuzzleModal, setShowPuzzleModal] = useState(false);
  const [content, setContent] = useState("");
  const [userRes, setUserRes] = useState("");
  const [result, setResult] = useState<Result>({
    isCorrect: true,
    text: null,
  });
  const [loading, setLoading] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);

  useEffect(() => {
    if (!showPuzzleModal) return;
    if (result.text || loading) return;
    const interval = setInterval(() => {
      setTimeTaken((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [showPuzzleModal, result.text, loading]);

  const fetchComments = async () => {
    try {
      const response = await api.get<
        Response<"comments", { comments: Comment[] }>
      >(`/puzzles/get-comments/${item._id}`);
      if (response.data.success && response.data.comments) {
        setComments(response.data.comments);
        return;
      }
      toast(
        "error",
        "Fetch error",
        "Error fetching comments. Please try again later."
      );
    } catch (error) {
      console.error(error);
      toast(
        "error",
        "Fetch error",
        "Error fetching comments. Please try again later."
      );
    }
  };

  const postComment = async () => {
    setLoading(true);
    try {
      const response = await api.post<Response>("/puzzles/post-comment", {
        id: item._id,
        userId: user?.id,
        name: user?.fullName,
        profileImage: user?.imageUrl,
        content: content,
      });
      if (response.data.success) {
        await fetchComments();
        setContent("");
        return;
      }
      toast(
        "error",
        "Creation error",
        "Error posting comment. Please try again later."
      );
    } catch (error) {
      console.error(error);
      toast(
        "error",
        "Creation error",
        "Error posting comment. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const like = async () => {
    if (!user?.id) return;

    let alreadyLiked: boolean;
    if (likes.includes(user.id)) {
      setLikes((prev) => prev.filter((item) => item !== user.id));
      alreadyLiked = true;
    } else {
      setLikes((prev) => [...prev, user.id]);
      setDislikes((prev) => prev.filter((item) => item !== user.id));
      alreadyLiked = false;
    }
    try {
      const response = await api.put<Response>("/puzzles/like-puzzle", {
        id: item._id,
        alreadyLiked,
      });
      if (!response.data.success) {
        toast(
          "error",
          "Update error",
          "Error updating puzzle likes. Please try again later."
        );
      }
    } catch (error) {
      console.error(error);
      toast(
        "error",
        "Update error",
        "Error updating puzzle likes. Please try again later."
      );
    }
  };

  const dislike = async () => {
    if (!user?.id) return;

    let alreadyDisliked: boolean;
    if (dislikes.includes(user.id)) {
      setDislikes((prev) => prev.filter((item) => item !== user.id));
      alreadyDisliked = true;
    } else {
      setDislikes((prev) => [...prev, user.id]);
      setLikes((prev) => prev.filter((item) => item !== user.id));
      alreadyDisliked = false;
    }
    try {
      const response = await api.put<Response>("/puzzles/dislike-puzzle", {
        id: item._id,
        alreadyDisliked,
      });
      if (!response.data.success) {
        toast(
          "error",
          "Update error",
          "Error updating puzzle dislikes. Please try again later."
        );
      }
    } catch (error) {
      console.error(error);
      toast(
        "error",
        "Update error",
        "Error updating puzzle dislikes. Please try again later."
      );
    }
  };

  const convertTime = (d: string) => {
    if (!d) return "";
    const newDate = new Date(d);
    const time = newDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const date = newDate.toDateString();
    return `Posted on ${date} at ${time}`;
  };

  const checkAnswer = async () => {
    setLoading(true);
    setResult((prev) => ({ ...prev, text: null }));
    try {
      const response = await api.post<
        Response<"correct", { correct: boolean }>
      >("/train/check-answer", {
        puzzle: item.question,
        response: userRes,
        answer: item.answer,
        difficulty: item.difficulty,
        category: item.category,
        id: item._id,
        timeTaken,
      });
      if (response.data.success && response.data.correct !== undefined) {
        setResult({
          isCorrect: response.data.correct,
          text: response.data.message,
        });
        return;
      }
      toast(
        "error",
        "Process Error",
        "Error checking response. Please try again later."
      );
      closeModal();
    } catch (error) {
      console.error(error);
      toast(
        "error",
        "Process Error",
        "Error checking response. Please try again later."
      );
      closeModal();
    } finally {
      setLoading(false);
      fetchUserSettings();
    }
  };

  const closeModal = () => {
    setShowPuzzleModal(false);
    setUserRes("");
    setResult({ isCorrect: true, text: null });
  };

  return (
    <TouchableOpacity
      onPress={() => setShowPuzzleModal(true)}
      className="w-full rounded-xl border-2 p-5 gap-5"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        maxWidth: width,
      }}
    >
      <ReactNativeModal
        isVisible={showPuzzleModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View
          className="p-5 h-full gap-5 rounded-xl"
          style={{ backgroundColor: colors.bg }}
        >
          <ScrollView contentContainerClassName="gap-5">
            <View className="w-full flex-row justify-between items-center">
              <Text
                className="text-3xl font-bold"
                style={{ color: colors.text }}
              >
                Try Puzzle
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close-circle" size={40} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: item.image.url }}
              className="w-full h-[200px] rounded-xl"
            />
            <View
              className="rounded-lg overflow-hidden"
              style={{ display: result.text ? "flex" : "none" }}
            >
              <LinearGradient
                colors={
                  result.isCorrect
                    ? colors.gradients.success
                    : colors.gradients.danger
                }
              >
                <Text className="text-lg font-medium text-white py-2 px-4">
                  {result.text}
                </Text>
              </LinearGradient>
            </View>
            <Text
              className="text-xl font-medium"
              style={{ color: colors.text }}
            >
              {item.question}
            </Text>
            <TextInput
              value={userRes}
              onChangeText={(text) => setUserRes(text)}
              multiline
              textAlignVertical="top"
              className="border-2 rounded-xl px-4 h-36 text-lg"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              }}
            />
            <TouchableOpacity
              onPress={checkAnswer}
              disabled={loading}
              className="rounded-xl overflow-hidden"
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              <LinearGradient className="py-3" colors={colors.gradients.empty}>
                {loading ? (
                  <View className="w-full flex-row items-center justify-center gap-2">
                    <ActivityIndicator size={25} color={colors.text} />
                    <Text
                      className="text-xl font-bold"
                      style={{ color: colors.text }}
                    >
                      Checking...
                    </Text>
                  </View>
                ) : (
                  <Text
                    className="text-center text-xl font-bold"
                    style={{ color: colors.text }}
                  >
                    Check Answer
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-xl overflow-hidden">
              <LinearGradient
                className="py-3 flex-row items-center justify-center gap-3 w-full"
                colors={colors.gradients.empty}
              >
                <Ionicons name="bulb" size={25} color={colors.text} />
                <Text
                  className="text-center text-xl font-bold"
                  style={{ color: colors.text }}
                >
                  Hint
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ReactNativeModal>
      <ReactNativeModal
        isVisible={showCommentsModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View
          className="p-5 h-full gap-5 rounded-xl"
          style={{ backgroundColor: colors.bg }}
        >
          <View className="w-full flex-row justify-between items-center">
            <Text className="text-3xl font-bold" style={{ color: colors.text }}>
              Commments ({comments.length})
            </Text>
            <TouchableOpacity onPress={() => setShowCommentsModal(false)}>
              <Ionicons name="close-circle" size={40} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View className="gap-4">
            {comments.length === 0 && (
              <View>
                <Text className="text-xl" style={{ color: colors.textMuted }}>
                  Be the first to comment!
                </Text>
              </View>
            )}
            {comments.map((item) => {
              return (
                <View key={item._id} className="flex-row gap-2">
                  <Image
                    source={{ uri: item.creator.profileImage }}
                    className="size-14 rounded-full"
                  />
                  <View className="flex-1">
                    <Text
                      className="text-xl font-medium"
                      style={{ color: colors.text }}
                    >
                      {item.creator.name}
                    </Text>
                    <Text style={{ color: colors.textMuted }}>
                      {item.content}
                    </Text>
                    <Text
                      className="text-sm mt-2"
                      style={{ color: colors.textMuted }}
                    >
                      {convertTime(item.createdAt)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
          <View>
            <View className="flex-row gap-2">
              <Image
                source={{ uri: user?.imageUrl }}
                className="size-14 rounded-full"
              />
              <View className="flex-1 gap-2">
                <TextInput
                  value={content}
                  onChangeText={(text) => setContent(text)}
                  className="border-2 rounded-xl px-4 h-24"
                  multiline
                  textAlignVertical="top"
                  placeholderTextColor={colors.textMuted}
                  placeholder="Enter your comment here. Please be respectful."
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                />
                <TouchableOpacity
                  disabled={loading}
                  onPress={postComment}
                  className="self-start rounded-lg overflow-hidden"
                  style={{
                    backgroundColor: colors.primary,
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  <LinearGradient
                    className="px-10 py-2"
                    colors={colors.gradients.primary}
                  >
                    {loading ? (
                      <View className="flex-row items-center justify-center gap-2">
                        <ActivityIndicator size={25} color="white" />
                        <Text className="text-xl font-medium text-white">
                          Posting...
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-xl font-medium text-white">
                        Post
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ReactNativeModal>
      <View>
        <Image
          source={{ uri: item.image.url }}
          className="w-full h-40 rounded-xl"
        />
      </View>
      <View className="gap-1">
        <Text
          className="text-xl font-semibold mb-1"
          style={{ color: colors.text }}
          numberOfLines={2}
        >
          {item.question}
        </Text>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <ScrollView
            horizontal
            contentContainerClassName="flex-row items-center gap-2"
            className="mt-1 mb-2"
          >
            <View
              className="py-1 px-3 rounded"
              style={{ backgroundColor: colors.gradients.empty[1] }}
            >
              <Text style={{ color: colors.text }}>{item.category}</Text>
            </View>
            <View
              className="py-1 px-3 rounded"
              style={{ backgroundColor: colors.gradients.empty[1] }}
            >
              <Text style={{ color: colors.text }}>{item.difficulty}</Text>
            </View>
          </ScrollView>
        </Pressable>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <ScrollView horizontal contentContainerClassName="flex-row gap-4">
            <TouchableOpacity className="flex-row gap-2" onPress={like}>
              <Ionicons name="thumbs-up" color={colors.text} size={25} />
              <Text className="text-xl" style={{ color: colors.text }}>
                {likes.length}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row gap-2" onPress={dislike}>
              <Ionicons name="thumbs-down" color={colors.text} size={25} />
              <Text className="text-xl" style={{ color: colors.text }}>
                {dislikes.length}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowCommentsModal(true)}
              className="flex-row items-center gap-2"
            >
              <Ionicons name="chatbox" size={25} color={colors.text} />
              <Text className="text-xl" style={{ color: colors.text }}>
                {comments.length}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <ScrollView horizontal contentContainerClassName="flex-row gap-4">
            <View className="flex-row gap-2">
              <Ionicons name="people" color={colors.text} size={25} />
              <Text className="text-xl" style={{ color: colors.text }}>
                {item.attempts.length}
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Ionicons name="checkmark" color={colors.text} size={25} />
              <Text className="text-xl" style={{ color: colors.text }}>
                {item.successes.length}
              </Text>
            </View>
          </ScrollView>
        </Pressable>
        <Text className="text-sm" style={{ color: colors.textMuted }}>
          {convertDate(item.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PuzzleCard;
