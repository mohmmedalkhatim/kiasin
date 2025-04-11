import Card from '../../../components/Cards/area_card';

function AreasList({list}: { list: number[] }) {
  
  return (
    <div className="p-4">
      <div className="boxs_grid">
        {list.map((item) => (
          <Card key={item} id={item} />
        ))}
      </div>
    </div>
  );
}

export default AreasList;
