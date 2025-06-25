import { Channel, invoke } from '@tauri-apps/api/core';
import { create } from 'zustand';
import { useAreas } from './areas';
import React from 'react';

type send_Media = {
  id?: number;
  file: string;
  media_type: string;
  url?: string;
  note_id?: number;
  project_id?: number;
  area_id?: number;
};
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
  create: (
    data: send_Media,
    store_fun: (media: Media[]) => void
  ) => Promise<void>;
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,

  ) => void;
  update: () => string;
  delete: () => void;
  get_image_url: (
    id: number,
    set_url: React.Dispatch<React.SetStateAction<string>>,
  ) => void;
  get_list: (ids: number[]) => string[];
}

export let useMedia = create<media>(_ => ({
  create: async (data, store_fun) => {
    let channel = new Channel<Media[]>();
    channel.onmessage = store_fun;
    await invoke('media_control', {
      payload: {
        command: 'create',
        item: data,
      },
      channel,
    });
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
  get_image_url: (id, set_url) => {
    let channel = new Channel<Media[]>();
    channel.onmessage = media => {
      let file = new Blob([new Uint8Array(media[0].file)], {
        type: media[0].media_type,
      });
      console.log(media[0].file);
      let url = URL.createObjectURL(file);
      console.log(file);
      set_url(url);
    };
    invoke('media_control', { payload: { command: 'find', id }, channel });
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
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      let [info, file] = reader.result?.toString().split(',') as string[];
      let create = useMedia.getState().create;
      let store: (m: Media[]) => void = media => {
        let card = useAreas.getState().get_Card(id);
        card.props = media[0].id;
        useAreas.getState().update_card(id, card);
      };
      create(
        {
          file,
          media_type: info,
        },
        store
      );
    };

    reader.onerror = e => {
      console.error('Error reading file:', e);
    };

    reader.readAsDataURL(file);
  },
}));
