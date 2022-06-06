import React, { Component, useEffect, useState } from "react"
import api from "../../../services/api"

const Images = props => {

  const vehicle = props.vehicle

  useEffect(() => {
    props.getImages()
  }, [])

    return (
      <div className="container pt-4">
        <div className="row">
          <div className="col-xl-6 col-lg-8 col-md-8 col-sm-12 m-auto">
            <div className="card shadow">
              <div className="card-header">
                <h4 className="card-title fw-bold"> Fotos cadastradas </h4>
              </div>
              <div className="card-body">
                <div className="row">
                  {
                    props.listImages.length > 0 ? (
                        props.listImages.map((image) => (
                        <div className="col-xl-6 col-lg-8 col-sm-12 col-12 mt-3" key={image.id}>
                            <img src={`http://localhost:8000/tenants/${vehicle.tenant_uuid}/vehicles/${vehicle.uuid}/${image.name}`} className="img-fluid img-bordered" width="200px"
                            />
                            <button onClick={e => {
                              e.preventDefault()
                              api.delete(`vehicles/${vehicle.uuid}/files/${image.uuid}`)
                              props.getImages()
                            }}>Excluir</button>
                        </div>
                        ))
                    ) : (
                        <h6 className="text-danger text-center">Nenhuma foto cadastrada </h6>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

export default Images