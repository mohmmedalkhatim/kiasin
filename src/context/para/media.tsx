import { Channel, invoke } from '@tauri-apps/api/core';
import { create } from 'zustand';

type Media = {
  id?: number;
  file: number[];
  url?: string;
  note_id?: number;
  project_id?: number;
  area_id?: number;
  media_type: string;
};

interface media {
  list: Media[];
  create: (data:Media) => string;
  update: () => string;
  delete: () => void;
  one: (id: number) => string;
  get_list: (ids: number[]) => string[];
}

export let useMedia = create<media>(set => ({
  list: [],
  create: (data) => {
    let channel = new Channel<Media>();
    let url: string[] = [];
    channel.onmessage = media => {
      let file = new Blob([new Uint8Array(media.file)], {
        type: media.media_type,
      });
      url.push(URL.createObjectURL(file));
    };
    invoke("media_control",{payload:{
        command:"create",
        item:data,
    }})
    return url[0];
  },
  update: () => {
    let channel = new Channel<Media>();
    let url: string[] = [];
    channel.onmessage = media => {
      let file = new Blob([new Uint8Array(media.file)], {
        type: media.media_type,
      });
      url.push(URL.createObjectURL(file));
    };
    return url[0];
  },
  delete: () => {},
  one: id => {
    let channel = new Channel<Media>();
    let url: string[] = [];
    channel.onmessage = media => {
      let file = new Blob([new Uint8Array(media.file)], {
        type: media.media_type,
      });
      url.push(URL.createObjectURL(file));
      file = new Blob();
    };
    return '';
  },
  get_list: () => {
    let channel = new Channel<Media[]>();
    let url: string[] = [];
    channel.onmessage = media => {
      media.map(() => {
        let channel = new Channel<Media>();
        channel.onmessage = media => {
          let file = new Blob([new Uint8Array(media.file)], {
            type: media.media_type,
          });
          url.push(URL.createObjectURL(file));
          file = new Blob();
        };
      });
    };
    return url;
  },
}));
