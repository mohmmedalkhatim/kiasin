import Card from '../../../components/Cards/area_card';

function AreasList(props: { list: number[] }) {
  return (
    <div className="p-4">
      <div className="boxs_grid">
        {props.list.map((item) => (
          <Card key={item} id={item} />
        ))}
      </div>
    </div>
  );
}

export default AreasList;
