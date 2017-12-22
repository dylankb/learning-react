class ProductList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      products: []
    }
    this.handleProductUpVote = this.handleProductUpVote.bind(this);
  }
  componentDidMount() {
    this.setState({ products: Seed.products });
  }
  handleProductVote(productId) {
    console.log(productId + ' was updated.')
  }
  handleProductUpVote(productId) {
    const nextProducts = this.state.products.map((product) => {
      if (product.id === productId) {
        return Object.assign({}, product, {
          votes: product.votes + 1,
        });
      } else {
        return product;
      }
    });
    this.setState({
      products: nextProducts,
    });
  }

  render() {
    const products = this.state.products.sort((productA, productB) => (
    productB.votes - productA.votes));

    const productComponents = products.map((product) => (
        <Product
          key={'product-' + product.id}
          id={product.id}
          title={product.title}
          description={product.description}
          url={product.url}
          votes={product.votes}
          submitterAvatarUrl={product.submitterAvatarUrl}
          productImageUrl={product.productImageUrl}
          onVote={this.handleProductUpVote}
        />
    ));
    return (
      <div className='ui unstackable items'>
        {productComponents}
      </div>
    );
  }
 }

class Product extends React.Component {
  constructor(props) {
    super(props)
    this.handleUpVote = this.handleUpVote.bind(this);
  }

  handleUpVote() {
    this.props.onVote(this.props.id);
  }
  render() {
    return (
      <div className='item'>
        <div className='image'>
          <img src={this.props.productImageUrl} />
        </div>
        <div className='middle aligned content'>
          <div className='header'>
            <a onClick={this.handleUpVote}>
              <i className='large caret up icon' />
            </a>
            {this.props.votes}
          </div>
          <div className='description'>
            <a href={this.props.url}>
              {this.props.title}
            </a>
            <p>
              {this.props.description}
            </p>
            <div className='extra'>
              <span>Submitted by:</span>
              <img
                className='ui avatar image'
                src='images/avatars/daniel.jpg'
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <ProductList />,
  document.getElementById('content')
);
