import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { Channel, invoke } from "@tauri-apps/api/core";
import { SheetDTO } from "../objects";
import { SheetStore } from "..";

export let update_sheet = createAsyncThunk(
  "sheets/update",
  async (data: SheetDTO, api) => {
    let channel = new Channel();
    await invoke("sheets_control", {
      payload: { command: "update", data },
      channel,
    }).catch((err) => {
      api.rejectWithValue(err);
    });
  },
);

export let update_table_thunk_builder = (
  builder: ActionReducerMapBuilder<SheetStore>,
) => {
  builder.addAsyncThunk(update_sheet, {
    pending: (state) => {
      state.loading = true;
      state.status = "pending";
    },
    fulfilled: (state) => {
      state.loading = false;
      state.status = "fulfilled";
    },
    rejected: (err) => { },
  });
};
