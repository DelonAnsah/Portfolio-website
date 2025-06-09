export default {
  name: 'project',
  title: 'project',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'projectType',
      title: 'Project type',
      type: 'string',
      options: {
        list: [
          {value: 'personal', title: 'Personal'},
          {value: 'client', title: 'Client'},
        ],
      },
    },
    {
      name: 'link',
      type: 'url',
    },
    {
      name: 'tags',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      Options: {
        hotspot:true,
      },
    },
  ],
};