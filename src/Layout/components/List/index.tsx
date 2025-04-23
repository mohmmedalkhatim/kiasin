import Card from '../../../components/Cards/area_card';

function AreasList({ list }: { list: number[] }) {
  return (
    <div className="p-4">
      <div className="px-4 pb-2 flex">
        <div className="">
          <div>areas</div>
          <div className="border"></div>
        </div>
      </div>
      <div className="m_border  mb-3 "></div>
      <div className="boxs_grid">
        {list.map((item) => (
          <Card key={item} id={item} />
        ))}
      </div>
    </div>
  );
}

export default AreasList;
