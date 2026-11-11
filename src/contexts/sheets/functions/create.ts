import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { Channel, invoke } from "@tauri-apps/api/core";
import { SheetDTO } from "../objects";
import { SheetStore } from "..";

export let create_sheet = createAsyncThunk("sheets/create", async (table: SheetDTO, api) => {
  let channel = new Channel();
  await invoke<any>("sheets_control", { payload: { command:"create", data: table }, channel })
    .catch((err) => {
      api.rejectWithValue(err);
    })
    .then((res) => {
      console.log("creating has been successful");
      console.log(res);
    });
});

export let create_table_thunk_builder = (builder: ActionReducerMapBuilder<SheetStore>) => {
  builder.addAsyncThunk(create_sheet, {
    pending: (state) => {
      ((state.loading = true), (state.status = "pending"));
    },
    fulfilled: (state) => {
      state.loading = false;
      state.status = "fullfilled";
    },
    rejected: () => { },
  });
};
