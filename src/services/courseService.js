import { courseApi } from "./api";

export function getCourses(params = {}) {
  return courseApi.list(params).then(({ courses }) => courses);
}

export function getCourseById(id) {
  return courseApi.get(id).then(({ course }) => course);
}
