import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { convertDate } from "@/app/(main)/user-profile";
import { Comment, Puzzle, Response } from "@/utils/types";
import { useUser } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import useApi from "@/utils/api";

type PuzzleCardProps = {
  item: Puzzle;
};

type Result = {
  isCorrect: boolean;
  text: string | null;
};

const PuzzleCard = ({ item }: PuzzleCardProps) => {
  const api = useApi();
  const { colors } = useTheme();
  const { user } = useUser();

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

  const fetchComments = async () => {
    try {
      const response = await api.get<
        Response<"comments", { comments: Comment[] }>
      >(`/puzzles/get-comments/${item._id}`);
      if (response.data.success && response.data.comments) {
        setComments(response.data.comments);
        console.log("Success");
      }
    } catch (error) {
      console.error(error);
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
        console.log("Success");
      }
      console.log(response.data.message);
    } catch (error) {
      console.error(error);
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
      if (response.data.success) {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
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
      if (response.data.success) {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
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
        response: userRes,
        answer: item.answer,
        id: item._id,
      });
      if (response.data.success && response.data.correct !== undefined) {
        setResult({
          isCorrect: response.data.correct,
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setShowPuzzleModal(false);
    setUserRes("");
    setResult({ isCorrect: true, text: null });
  };

  return (
    <TouchableOpacity
      onPress={() => setShowPuzzleModal(true)}
      className="w-full rounded-xl border-2 p-5 flex-row gap-5"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <Modal visible={showPuzzleModal} animationType="slide">
        <View
          className="p-5 h-full gap-5"
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
              <TouchableOpacity onPress={close}>
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
      </Modal>
      <Modal visible={showCommentsModal} animationType="slide">
        <View
          className="p-5 h-full gap-5"
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
      </Modal>
      <View>
        <Image
          source={{ uri: item.image.url }}
          className="w-28 h-40 rounded-xl"
        />
      </View>
      <View className="flex-1">
        <Text
          className="text-xl font-semibold mb-1"
          style={{ color: colors.text }}
          numberOfLines={2}
        >
          {item.question}
        </Text>
        <View className="flex-row items-center gap-2 mt-1 mb-2">
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
        </View>
        <View className="flex-row gap-4">
          <TouchableOpacity className="flex-row gap-2" onPress={like}>
            <Ionicons name="thumbs-up" color={colors.text} size={20} />
            <Text className="text-lg" style={{ color: colors.text }}>
              {likes.length}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row gap-2" onPress={dislike}>
            <Ionicons name="thumbs-down" color={colors.text} size={20} />
            <Text className="text-lg" style={{ color: colors.text }}>
              {dislikes.length}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowCommentsModal(true)}
            className="flex-row items-center gap-2"
          >
            <Ionicons name="chatbox" size={20} color={colors.text} />
            <Text className="text-lg" style={{ color: colors.text }}>
              {comments.length}
            </Text>
          </TouchableOpacity>
        </View>
        <Text className="text-sm" style={{ color: colors.textMuted }}>
          {convertDate(item.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PuzzleCard;
